import React from 'react';
import ReactDOM from 'react-dom';
import HomePage from './Movies/home';
import reportWebVitals from './reportWebVitals';
import ViewMovie from './Movies/view';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	useParams,
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.css';
import 'react-dynamic-swiper/lib/styles.css';

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<Switch>
				<Route exact path="/">
					<HomePage />
				</Route>
				<Route path="/page/:page">
					<HomePage />
				</Route>
				<Route path="/Movie/:id/:name">
					<ViewMovie />
				</Route>
			</Switch>
		</Router>

	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
