import React, { useState, useRef, useEffect } from 'react';
import PlayIcon from '../images/icon/play.svg';
import StarOn from '../images/icon/starOn.svg';
import StarOff from '../images/icon/starOff.svg';
import { useParams, useHistory } from "react-router-dom";



export default function ViewMovie() {
	let history = useHistory();
	let { id } = useParams();

	let [movie, setMovie] = useState([]);
	let url = "https://yts.mx/api/v2/movie_details.json?movie_id=" + id + "&with_images=true&with_cast=true";
	let [showTailer, setShowTailer] = useState(false);
	let trailerRef = useRef(null);

	useEffect(() => {
		fetch(url).then((response) => {
			return response.json();
		}).then((MovieDetails) => {
			setMovie(MovieDetails['data']['movie'])
			console.log(MovieDetails)
		})
	}, []);

	let hours = (movie['runtime'] / 60);
	let rhours = Math.floor(hours);
	let minutes = (hours - rhours) * 60;
	let rminutes = Math.round(minutes);
	let runTime = rhours + "h " + rminutes + "min";
	let gen = movie.genres ? movie.genres : [];


	let openTrailer = () => {
		setShowTailer(!showTailer);
		if (!showTailer) {
			trailerRef.current.classList.add("showTrailerAnim");
		} else {
			trailerRef.current.classList.remove("showTrailerAnim");
		}


	}

	return <>
		<div className="view-movie">
			<div className="view-movie-overlay"></div>
			<img className="movie-background" src={movie['background_image']} alt="" />
			<img className="movie-title-image" src={movie['large_cover_image']} alt="" />
			<div className="movie-details">
				<h3 className="movie-year">{movie['year']}</h3>
				<h1 className="movie-name">{movie['title']}</h1>
				<p>{movie['description_full']}</p>
				<div className="wt" >
					<button className="watch-trailer-btn " onClick={() => openTrailer()}><img className="w-100" src={PlayIcon} alt="" /></button>
					<span>WATCH TRAILER</span>
				</div>
				<div className="wt ml-3">
					<ul>
						<li>{runTime}
						</li>
						<li>
							{
								gen.map((genre, i) => {
									if (i + 1 == gen.length) {
										return genre;
									} else {
										return genre + ' , ';
									}
								})
							}
						</li>
						<li>December 9, 2022</li>
					</ul>
				</div>
			</div>

		</div>
		<div className="movie-information">
			<div className="info-flex">
				<small>Rating {movie['rating']}</small>
				<img className="star" src={movie['rating'] > 0 ? StarOn : StarOff} alt="" />
				<img className="star" src={movie['rating'] > 1.5 ? StarOn : StarOff} alt="" />
				<img className="star" src={movie['rating'] > 2.5 ? StarOn : StarOff} alt="" />
				<img className="star" src={movie['rating'] > 3.5 ? StarOn : StarOff} alt="" />
				<img className="star" src={movie['rating'] > 4.5 ? StarOn : StarOff} alt="" />
				<img className="star" src={movie['rating'] > 5.5 ? StarOn : StarOff} alt="" />
				<img className="star" src={movie['rating'] > 6.5 ? StarOn : StarOff} alt="" />
				<img className="star" src={movie['rating'] > 7.5 ? StarOn : StarOff} alt="" />
				<img className="star" src={movie['rating'] > 8.5 ? StarOn : StarOff} alt="" />
				<img className="star" src={movie['rating'] > 9.5 ? StarOn : StarOff} alt="" />
			</div>
			<div className="info-flex pt-2">
				<small>Available In </small>
				<label className="pr-2">720p.Bluray</label>
				<label className="pr-2">720p.WEB</label>
				<label className="pr-2">1080p.Web</label>
			</div>
			<button onClick={() => history.goBack()} className="historyBack">BACK</button>
		</div>
		<div className="move-video-trailer" ref={trailerRef}>
			<button className="trailerClose" onClick={() => openTrailer()}>CLOSE</button>
			<iframe controls="0" modestbranding="0" src={'https://www.youtube.com/embed/' + movie['yt_trailer_code']} frameBorder="0"></iframe>
		</div>
	</>
} 