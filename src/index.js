import './style.css';
import './assets/cat-news.jpg';

let lastUrl = '', page = 0, newsDisplayed = 0;

const hide = (element) => {
  document.querySelector(element).style.display = 'none';
};

const show = (element) => {
  document.querySelector(element).style.display = 'unset';
};

loadSources();
loadBy('top-headlines?country=ru&pageSize=5&page=1&');

document.querySelector('#load-btn').addEventListener('click', () => {
  append();
});

document.querySelector('#filter-btn').addEventListener('click', () => {
  const query = document.querySelector('#search-field').value;
  if(query.length > 0){
    loadBy(`everything?q=${query}&pageSize=5&page=1&`);
  }
});

document.querySelector('#search-field')
    .addEventListener('keyup', function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.querySelector('#filter-btn').click();
    }
});

document.querySelector('#sources').addEventListener('click', (event) =>{
  loadBy(`everything?sources=${event.target.id}&pageSize=5&page=1&`);
});

function loadSources(){
  const url = 'https://newsapi.org/v2/sources?apiKey=5878ce9411164b5398895920c506a413';
  const request = new Request(url);
  fetch(request)
    .then(function(response) { return response.json(); })
    .then(function(data) {
      for (let i = 0; i < data.sources.length; i++) {
        document.querySelector('#sources').innerHTML += '<button class="app__btn btn__sources" id="' + data.sources[i].id + '">' + data.sources[i].name + '</button>';
      }
    });
}

function createNewsItem(token, data){
  token.querySelector('.news__picture').style.backgroundImage = `url(${data.urlToImage ? data.urlToImage : 'img/cat-news.jpg'})`;
  token.querySelector('.news__title').textContent = data.title;
  token.querySelector('.news__source').textContent = data.source.name;
  token.querySelector('.news__text').textContent = data.description;
  token.querySelector('.news__link').setAttribute('href', data.url);
  return token;
}

function createBlock(newsCount, data){
  const place = document.createDocumentFragment();
  const news_item = document.querySelector('#news-item-tpl');
  for (let i = 0; i < newsCount; i++) {
    const item = (news_item.content) ? news_item.content.cloneNode(true).querySelector('.news__item') 
      : news_item.querySelector('.news__item').cloneNode(true);
    const child = createNewsItem(item, data[i]);
    place.appendChild(child);
  }
  return place;
}

function loadBy(urlPart){
  hide('#error-block');
  const url = 'https://newsapi.org/v2/' + urlPart + 'apiKey=5878ce9411164b5398895920c506a413';
  const request = new Request(url);
  fetch(request)
    .then(function(response) { return response.json(); })
    .then(function(data) {  
      const newsBlock = document.querySelector('#news');
      newsBlock.innerHTML = '';
      const newsCount = data.articles.length;
      if(newsCount == 0){
        show('#error-block');
        hide('#load-btn');
        return;
      }      
      const block = createBlock(newsCount, data.articles);
      newsBlock.appendChild(block);
      if(newsCount < 5){
        hide('#load-btn');
      }else{
        show('#load-btn');
      }
      lastUrl = url;
      page = 2;
      newsDisplayed = newsCount;
    });
}

function append(){
  lastUrl = lastUrl.replace(new RegExp('page=.*&'), 'page=' + page + '&');
  const request = new Request(lastUrl);
  fetch(request)
    .then(function(response) { return response.json(); })
    .then(function(data) {
      const newsCount = data.articles.length;
      if(newsCount == 0){
        hide('#load-btn');
        return;
      }     
      const block = createBlock(newsCount, data.articles);
      const newsBlock = document.querySelector('#news');
      newsBlock.appendChild(block);
      newsDisplayed += newsCount;
      page++;
      if(newsCount < 5 || newsDisplayed == 40){
        hide('#load-btn');
      }
    });
}
