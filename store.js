import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

const exampleInitialState = {
  lastUpdate: 0,
  light: false,
  count: 0,
  logo: null,
  changeLogo: null,
  main_article: [],
  articles: [],
  lang: '',
  wp_endpoint: 'https://www.hackweb.it/hw_wordpress/wp-json/wp/v2/'
}

export const actionTypes = {
  TICK: 'TICK',
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
  RESET: 'RESET',
  CHANGE_LOGO: 'CHANGE_LOGO',
  HOMEPAGE_ARTICLES: 'HOMEPAGE_ARTICLES',
  SET_LANG: 'SET_LANG'
}

// REDUCERS
export const reducer = (state = exampleInitialState, action) => {
  switch (action.type) {
    case actionTypes.TICK:
      return Object.assign({}, state, {
        lastUpdate: action.ts,
        light: !!action.light
      })
    case actionTypes.INCREMENT:
      return Object.assign({}, state, {
        count: state.count + 1
      })
    case actionTypes.DECREMENT:
      return Object.assign({}, state, {
        count: state.count - 1
      })
    case actionTypes.RESET:
      return Object.assign({}, state, {
        count: exampleInitialState.count
      })
    case actionTypes.CHANGE_LOGO:
      return Object.assign({}, state, {
        changeLogo: action.changeLogo
      })
    case actionTypes.HOMEPAGE_ARTICLES:
      if(action.homepage_articles.main_article == null){
        action.homepage_articles = {        
          main_article: state.main_article,
          articles: action.homepage_articles.articles
        }
      }else{
        action.homepage_articles = {
          main_article: action.homepage_articles.main_article,
          articles: state.articles
        }        
      }  
      return Object.assign({}, state,{
        main_article: action.homepage_articles.main_article,
        articles: action.homepage_articles.articles
      })
    case actionTypes.SET_LANG:
      return Object.assign({}, state, {
        lang: action.lang
      })
    default: return state
  }
}

// ACTIONS
export const serverRenderClock = (isServer) => dispatch => {
  return dispatch({ type: actionTypes.TICK, light: !isServer, ts: Date.now() })
}

export const startClock = dispatch => {
  return setInterval(() => {
    // Dispatch `TICK` every 1 second
    dispatch({ type: actionTypes.TICK, light: true, ts: Date.now() })
  }, 1000)
}

export const incrementCount = () => dispatch => {
  return dispatch({ type: actionTypes.INCREMENT })
}

export const decrementCount = () => dispatch => {
  return dispatch({ type: actionTypes.DECREMENT })
}

export const resetCount = () => dispatch => {
  return dispatch({ type: actionTypes.RESET })
}

export const changeLogoAction = (changeLogoFunction) => dispatch => {
  return dispatch({ type: actionTypes.CHANGE_LOGO, changeLogo: changeLogoFunction})
}

export const saveHomepageArticles = (homepage_articles) => dispatch => {
  return dispatch({ type: actionTypes.HOMEPAGE_ARTICLES, homepage_articles: homepage_articles})
}

export const setLang = (lang) => dispatch => {
  return dispatch({ type: actionTypes.SET_LANG, lang: lang})
}

export function initializeStore (initialState = exampleInitialState) {
  return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)))
}