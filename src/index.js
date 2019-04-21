import './style.css';
import './assets/cat-news.jpg';

var lastUrl = '', page = 0, newsDisplayed = 0;

const hideLoadBtn = () => { 
  document.querySelector('#load-btn').style.display = 'none';
};

const showLoadBtn = () => { 
  document.querySelector('#load-btn').style.display = 'unset';
};

const showError = () => {
  document.querySelector('#error-block').style.display = 'block';
};

const hideError = () => {
  document.querySelector('#error-block').style.display = 'none';
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

function loadSources(){
  var url = 'https://newsapi.org/v2/sources?apiKey=5878ce9411164b5398895920c506a413';
  var request = new Request(url);
  fetch(request)
    .then(function(response) { return response.json(); })
    .then(function(data) {
      for (var i = 0; i < data.sources.length; i++) {
        document.querySelector('#sources').innerHTML += '<button class="app__btn btn__sources" id="' + data.sources[i].id + '">' + data.sources[i].name + '</button>';
      }
      Array.from(document.querySelectorAll('.btn__sources')).forEach(item => {
        item.addEventListener('click', () => {
          loadBy(`everything?sources=${item.id}&pageSize=5&page=1&`);
        });
      });

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

function loadBy(urlPart){
  hideError();
  var url = 'https://newsapi.org/v2/' + urlPart + 'apiKey=5878ce9411164b5398895920c506a413';
  var request = new Request(url);
  fetch(request)
    .then(function(response) { return response.json(); })
    .then(function(data) {
      const newsCount = data.articles.length;
      if(newsCount == 0){
        const newsBlock = document.querySelector('#news');
        newsBlock.innerHTML = '';
        showError();
        hideLoadBtn();
        return;
      }      
      const place = document.createDocumentFragment();
      const news_item = document.querySelector('#news-item-tpl');

      for (var i = 0; i < newsCount; i++) {

        const item = (news_item.content) ? news_item.content.cloneNode(true).querySelector('.news__item') 
          : news_item.querySelector('.news__item').cloneNode(true);

        const child = createNewsItem(item, data.articles[i]);

        place.appendChild(child);
      }

      const newsBlock = document.querySelector('#news');
      newsBlock.innerHTML = '';
      newsBlock.appendChild(place);
      if(newsCount < 5)
        hideLoadBtn();
      else
        showLoadBtn();
      lastUrl = url;
      page = 2;
      newsDisplayed = newsCount;
    });
}

function append(){
  lastUrl = lastUrl.replace(new RegExp('page=.*&'), 'page=' + page + '&');
  var request = new Request(lastUrl);
  fetch(request)
    .then(function(response) { return response.json(); })
    .then(function(data) {
      const newsCount = data.articles.length;
      if(newsCount == 0){
        hideLoadBtn();
        return;
      }     
      const place = document.createDocumentFragment();
      const news_item = document.querySelector('#news-item-tpl');

      for (var i = 0; i < newsCount; i++) {
        const item = (news_item.content) ? news_item.content.cloneNode(true).querySelector('.news__item') 
          : news_item.querySelector('.news__item').cloneNode(true);
        const child = createNewsItem(item, data.articles[i]);
        place.appendChild(child);
      }

      const newsBlock = document.querySelector('#news');
      newsBlock.appendChild(place);
      newsDisplayed += newsCount;
      page++;
      if(newsCount < 5 || newsDisplayed == 40)
        hideLoadBtn();
    });
}
