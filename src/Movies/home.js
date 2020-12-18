import React, { useState, useRef, useEffect } from 'react';
import NavIcon from '../images/icon/nav.svg';
import SearchIcon from '../images/icon/search.svg';
import CloseIcon from '../images/icon/close.svg';
import DropIcon from '../images/icon/dropIcon.svg';
import NextIcon from '../images/icon/next.svg';
import BackIcon from '../images/icon/back.svg';
import { Swiper, Slide } from 'react-dynamic-swiper';
import FeaturedPlaceHolder from '../images/bg/moviePlaceHolderX.jpg';
import { useParams, Link } from "react-router-dom";

export default function HomePage() {

	let { page } = useParams();

	let p = page ? page : 1;

	let url = "https://yts.mx/api/v2/list_movies.json?page=" + p;
	let latest4Url = "https://yts.mx/api/v2/list_movies.json?quality=3D";

	let [isSidebarOpen, setIsSidebarOpen] = useState(false);
	let sideBarRef = useRef(null);
	let [browse, setBrowse] = useState({ 'quality': false, 'genre': false, 'rating': false, 'year': false, 'language': false, 'order': false });
	let [moviesData, setMoviesData] = useState([]);
	let [latest, setLatest] = useState([]);
	let [loading, setLoading] = useState({ 'featured': 0, 'list': 0 })
	let [pages, setPages] = useState([]);

	let openSidebar = function () {
		if (!isSidebarOpen) {
			sideBarRef.current.style.left = 0;
			isSidebarOpen = true;
		} else {
			sideBarRef.current.style.left = '-110%';
			isSidebarOpen = false;
		}
	}

	let initDrop = function (name) {
		setBrowse({ ...browse, [name]: !browse[name] })
	}




	useEffect(() => {
		console.log("refetching url", url);
		fetch(url).then((response) => {
			return response.json();
		}).then((Datamovies) => {
			setMoviesData(Datamovies['data']['movies'])

			setLoading((loading) => {
				return { ...loading, ['featured']: 1 };
			});


			let start = 1;
			let limit = 10;
			let max = 10;
			let pageNow = Math.floor((page - 1) / limit) + 1;

			if (page > 10) {
				start = ((pageNow * max) - max) + 1;
				limit = pageNow * max;

			}


			let movieCount = Datamovies.movie_count;

			let pagesArr = {
				'app_page': [],
				'next': '',
				'prev': '',
			};


			pagesArr['next'] = (max * pageNow) + 1;
			pagesArr['prev'] = start - max;

			if (start < 10) {
				pagesArr['prev'] = 1;
			}

			if (limit > movieCount) {
				limit = movieCount;
			}

			for (let x = start; x <= limit; x++) {
				if (Datamovies.data.page_number == x) {
					pagesArr['app_page'].push({ 'page': x, 'active': true });
				} else {
					pagesArr['app_page'].push({ 'page': x, 'active': false });
				}
			}

			setPages((pages) => {
				return { ...pages, ['pages']: pagesArr }
			})
		});

		fetch(latest4Url).then((response) => {
			return response.json();
		}).then((LatestMovies) => {
			setLatest(LatestMovies['data']['movies']);
			setLoading((loading) => {
				return { ...loading, ['list']: 1 };
			});
		});

	}, [url, latest4Url]);

	return (
		<>
			<div className="nav-sidebar" ref={sideBarRef}>
				<div className="row">
					<div className="col-md-6">
						<div className="sidebar-menu">
							<div className="close-icon"> <img src={CloseIcon} alt="" onClick={() => openSidebar()} /> </div>
							<ul>
								<li data-title="Home" className="active">Home</li>
								<li data-title="4k">4k</li>
								<li data-title="Trending">Trending</li>
								<li data-title="Browse Movies">Browse Movies</li>
							</ul>
						</div>
					</div>
					<div className="col-md-6 right-bg"></div>
				</div>
			</div>
			<div className="navigation">
				<div className=" nav-left-content">
					<div className="nav-icon px-2">
						<img className="nav-icon" src={NavIcon} alt="" onClick={() => openSidebar()} />
					</div>
					<div className="nav-brand px-2">NEXX</div>
				</div>
				<div className="nav-right-content">
					<div className="menu">Home</div>
					<div className="menu">4k</div>
					<div className="menu">Trending</div>
					<div className="menu">Browse Movies</div>
					<div className="menu">
						<img className="nav-icon" src={SearchIcon} alt="" />
					</div>
				</div>
			</div>
			{loading['featured'] == 1 ?
				<section className="wrapper">
					<Swiper
						swiperOptions={{
							slidesPerView: 2,
							loop: true,
							autoplay: {
								delay: 3500,
								disableOnInteraction: false
							},
						}}
						navigation={false}
						pagination={false}
					>
						{
							latest.map((latestMovie) => {
								let { background_image_original, large_cover_image, title, genres, id, slug } = latestMovie;
								let movieURL = '/Movie/' + id + '/' + slug;
								return <Slide key={id} >
									<div className="swiper-overlay" >
										<div className="details">
											<Link to={movieURL}>
												<h2>{title}</h2>
											</Link>

											<label className="tags">
												{
													genres.map((genre, i) => {
														if (i + 1 == genres.length) {
															return genre;
														} else {
															return genre + ' | ';
														}
													})
												}
											</label>
										</div>
										<img className="overlay-image" src={large_cover_image} alt="" />
										<p>Watch The Trailer</p>
									</div>
									<img className="w-100" src={background_image_original} onError={(e) => { e.target.onerror = null; e.target.src = FeaturedPlaceHolder }} alt="" />
								</Slide >
							})
						}

					</Swiper>
				</section>
				:
				<section className="wrapper text-center">
					<h2>Fetching Data</h2>
				</section>

			}
			<section className="py-4">
				<div className="wrapper browse-movies">
					<input placeholder="Search .." type="text" />
					<div className="select-option" onClick={() => initDrop('quality')}>
						Quality
						<span className="dropIcon float-right">
							<img src={DropIcon} alt="" />
						</span>
						{browse['quality'] &&
							<div className="option-list" >
								<ul>
									<li>All</li>
									<li>720p</li>
									<li>1080p</li>
									<li>2160p</li>
									<li>3D</li>
								</ul>
							</div>
						}
					</div>
					<div className="select-option" onClick={() => initDrop('genre')}>
						Genre
						<span className="dropIcon float-right">
							<img src={DropIcon} alt="" />
						</span>
						{browse['genre'] &&
							<div className="option-list" >
								<ul>
									<li>All</li>
									<li>Action</li>
									<li>Adventure</li>
									<li>Animation</li>
									<li>Biography</li>
									<li>Comedy</li>
									<li>Crime</li>
									<li>Documentary</li>
									<li>Drama</li>
									<li>Family</li>
									<li>Fantasy</li>
									<li>Film Noir</li>
									<li>Game Show</li>
									<li>History</li>
									<li>Horror</li>
									<li>Music</li>
									<li>Musical</li>
									<li>Mystery</li>
									<li>News</li>
									<li>Reality Tv</li>
									<li>Romance</li>
									<li>Sci-fi</li>
									<li>Talk Show</li>
									<li>Thriller</li>
									<li>War</li>
									<li>Western</li>
								</ul>
							</div>
						}
					</div>
					<div className="select-option" onClick={() => initDrop('rating')}>
						Rating
						<span className="dropIcon float-right">
							<img src={DropIcon} alt="" />
						</span>
						{browse['rating'] &&
							<div className="option-list" >
								<ul>
									<li>All</li>
									<li>9+</li>
									<li>8+</li>
									<li>7+</li>
									<li>6+</li>
									<li>5+</li>
									<li>4+</li>
									<li>3+</li>
									<li>2+</li>
									<li>1+</li>
								</ul>
							</div>
						}
					</div>
					<div className="select-option" onClick={() => initDrop('year')}>
						Year
						<span className="dropIcon float-right">
							<img src={DropIcon} alt="" />
						</span>
						{browse['year'] &&
							<div className="option-list" >
								<ul>
									<li>All</li>
									<li>2020</li>
									<li>2019</li>
									<li>2015-2018</li>
									<li>2010-2014</li>
									<li>2000-2009</li>
									<li>1990-1999</li>
									<li>1980-1989</li>
									<li>1970-1979</li>
									<li>1950-1969</li>
									<li>1900-1949</li>
								</ul>
							</div>
						}
					</div>
					<div className="select-option" onClick={() => initDrop('language')}>
						Language
						<span className="dropIcon float-right">
							<img src={DropIcon} alt="" />
						</span>
						{browse['language'] &&
							<div className="option-list" >
								<ul>
									<li>English</li>
									<li>Foreign</li>
									<li>Japanese</li>
									<li>French</li>
									<li>Italian (379)</li>
									<li>German (369)</li>
									<li>Spanish (358)</li>
									<li>Chinese (343)</li>
									<li>Hindi (314)</li>
									<li>Cantonese (289)</li>
									<li>Korean (285)</li>
									<li>Russian (122)</li>
									<li>Swedish (115)</li>
									<li>Portuguese (95)</li>
									<li>Polish (84)</li>
									<li>Danish (57)</li>
									<li>Telugu (50)</li>
									<li>Norwegian (48)</li>
									<li>Thai (47)</li>
									<li>Finnish (41)</li>
									<li>Dutch (41)</li>
									<li>Czech (39)</li>
									<li>Turkish (29)</li>
									<li>Vietnamese (29)</li>
									<li>Indonesian (25)</li>
									<li>Persian (21)</li>
									<li>Greek (17)</li>
									<li>Arabic (16)</li>
									<li>Hebrew (15)</li>
									<li>Hungarian (14)</li>
									<li>Urdu (13)</li>
									<li>Tagalog (13)</li>
									<li>Malay (11)</li>
									<li>Bangla (10)</li>
									<li>Icelandic (8)</li>
									<li>Romanian (7)</li>
									<li>Catalan (6)</li>
									<li>Malayalam (6)</li>
									<li>Ukrainian (5)</li>
									<li>Estonian (5)</li>
									<li>Serbian (4)</li>
									<li>Punjabi (4)</li>
									<li>xx (3)</li>
									<li>Afrikaans (3)</li>
									<li>Kannada (3)</li>
									<li>Basque (3)</li>
									<li>Norwegian Bokmål (2)</li>
									<li>Marathi (2)</li>
									<li>Mongolian (2)</li>
									<li>Bosnian (2)</li>
									<li>Latin (2)</li>
									<li>Abkhazian (2)</li>
									<li>Tibetan (1)</li>
									<li>Pashto (1)</li>
									<li>Amharic (1)</li>
									<li>Akan (1)</li>
									<li>Kyrgyz (1)</li>
									<li>Serbo-Croatian (1)</li>
									<li>Haitian Creole (1)</li>
									<li>Georgian (1)</li>
									<li>Azerbaijani (1)</li>
									<li>Wolof (1)</li>
									<li>Somali (1)</li>
									<li>Inuktitut (1)</li>
									<li>Luxembourgish (1)</li>
									<li>Galician (1)</li>
									<li>Swahili (1)</li>
									<li>Maori (1)</li>
									<li>Afar (1)</li>
									<li>Irish (1)</li>
									<li>Yiddish (1)</li>
									<li>Khmer (1)</li>
									<li>Latvian (1)</li>
									<li>Macedonian</li>
									<li>Ossetic (1)</li>
									<li>Slovak (1)</li>
								</ul>
							</div>
						}
					</div>
					<div className="select-option" onClick={() => initDrop('order')}>
						Order by
						<span className="dropIcon float-right" >
							<img src={DropIcon} alt="" />
						</span>
						{browse['order'] &&
							<div className="option-list" >
								<ul>
									<li>Latest</li>
									<li>Oldest</li>
									<li>Featured</li>
									<li>Seeds</li>
									<li>Peers</li>
									<li>Year</li>
									<li>Rating</li>
									<li>Likes</li>
									<li>Alphabetical</li>
									<li>Downloads</li>
								</ul>
							</div>
						}
					</div>
					<button className="search-btn">Search</button>
				</div>
			</section>
			{loading['list'] == 1 ?
				<section className="wrapper movie-parent">
					{
						moviesData.map((movie) => {
							const { large_cover_image, title, genres, year, id, rating, slug } = movie;
							let gen = movie.genres ? movie.genres : [];
							let movieURL = '/Movie/' + id + '/' + slug;
							return <article className="movie-box" key={id}>

								<div className="movie-image">
									<div className="movie-overlay"></div>
									<div className="movie-details-overlay">
										<h3>{rating} / 10</h3>
										<h4>
											{
												gen.map((genre, i) => {
													if (i + 1 == gen.length) {
														return genre;
													} else {
														return genre + ' | ';
													}
												})
											}
										</h4>

										<Link to={movieURL}>
											<button>View Details</button>
										</Link>

									</div>
									<img src={large_cover_image} alt="" />
								</div>

								<div className="movie-details py-3">

									<h2>{title}</h2>
									<label className="tags">

										{

											gen.map((genre, i) => {

												if (i + 1 == gen.length) {
													return genre;
												} else {
													return genre + ' | ';
												}
											})
										}
									</label>
									<br />
									<small>( {year} )</small>
								</div>
							</article>
						})
					}

					<ul className="application_page_num mt-5">
						<Link to={pages.pages ? '/page/' + pages.pages.prev : '#'}>
							<li ><img src={BackIcon} alt="" /></li>
						</Link>
						{pages.pages ?
							pages.pages.app_page.map((p) => {
								if (p['active']) {
									return <Link key={p['page']} to={'/page/' + p['page']}><li className="active">{p['page']}</li></Link>
								} else {
									return <Link key={p['page']} to={'/page/' + p['page']}><li>{p['page']}</li></Link>
								}
							})
							:
							''
						}

						<Link to={pages.pages ? '/page/' + pages.pages.next : '#'}>
							<li ><img src={NextIcon} alt="" /></li>
						</Link>
					</ul>
				</section>

				:
				<section className="wrapper text-center">
					<h2>Fetching Data</h2>
				</section>
			}


		</>


	);

}