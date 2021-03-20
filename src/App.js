/*
chave da API que retirar da aula (o dono é o próprio professor, pretendo gerar a minha 
própria depois): 38c007f28d5b66f36b9c3cf8d8452a4b

exemplo de requisição de API https://api.themoviedb.org/3/movie/550?api_key=38c007f28d5b66f36b9c3cf8d8452a4b

*/

import React, { useEffect, useState } from 'react';
import './App.css'
import tmdb from './tmdb';
import MovieRow from './components/movieRow';
import FeaturedMovie from './components/featuredMovie';
import Header from './components/header';

export default () => {

    const [movieList, setMovieList] = useState([]);
    const [featuredData, setFeaturedData] = useState(null);
    const [blackHeader, setBlackHeader] = useState(false);

    useEffect(() => {
        const loadAll = async () => {
            // Pegando a lista total
            let list = await tmdb.getHomeList();
            console.log(list);
            setMovieList(list);

            // Pegando o Featured (filme em destaque)
            let originals = list.filter(i=> i.slug === 'originals');
            let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
            let chosen = originals[0].items.results[randomChosen];
            let chosenInfo = await tmdb.getMoviewInfo(chosen.id, 'tv');
            setFeaturedData(chosenInfo);
        }

        loadAll();
    }, []);

    useEffect(() => {
        const scrollListener = () => {
            if (window.scrollY > 10) {
                setBlackHeader(true);
            } else {
                setBlackHeader(false);
            }
        };

        window.addEventListener('scroll', scrollListener);

        return () => {
            window.removeEventListener('scroll', scrollListener);
        }

    }, []);

    return  (
        <div className="page">

            <Header black={blackHeader}/>

            {featuredData && 
            <FeaturedMovie item={featuredData} />
            }
            
            <section className="lists">
                {movieList.map((item, key) => (
                    <MovieRow key={key} title={item.title} items={item.items}/>

                ))}
            </section>

            <footer>
                Feito para estudos de front-end usando React.<br/>
                Direitos de imagem para Netflix.<br/>
                Dados pegos do site Themoviedb.org.<br/>
            </footer>
            
            {movieList.length <= 0 &&
            <div className="loading">
                <img src="https://media.wired.com/photos/592744d3f3e2356fd800bf00/master/w_2560%2Cc_limit/Netflix_LoadTime.gif"></img>
            </div>
            }

        </div>
    );
}
