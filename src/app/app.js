import 'nprogress/nprogress.css';
import './app.less';
import NProgress from 'nprogress';
import { render } from 'react-dom';
import Routes from './routes.jsx';

NProgress.start();
window.onload = () => {
  NProgress.done();
};
document.title = "AI种植系统";
render(Routes, document.getElementById('App'));