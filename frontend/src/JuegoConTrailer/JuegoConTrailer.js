import React, { useState } from 'react';
import stardew_valley_vid from "../trailers/Stardew_Valley.mp4";
import dark_souls_vid from "../trailers/Dark_Souls_III.mp4";
import dbd_vid from "../trailers/dbd.mp4";
import elden_ring_vid from "../trailers/ELDEN_RING.mp4";
import fall_guys_vid from "../trailers/Fall_Guys.mp4";
import gtav_vid from "../trailers/gtav.mp4";
import lol_vid from "../trailers/lol.mp4";
import read_dead_dedemption_vid from "../trailers/rdr2.mp4";
import sea_of_thieves_vid from "../trailers/Sea_of_Thieves.mp4";
import valorant_vid from "../trailers/VALORANT.mp4";
import victory_road_vid from "../trailers/Victory_Road.mp4";
import f1 from "../trailers/F1_2024.mp4";
import './JuegoConTrailer.css';
import { useNavigate } from 'react-router-dom';

const JuegoConTrailer = ({ juego }) => {
    const [reproduciendo, setReproduciendo] = useState(false);
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        setReproduciendo(true);
    };

    const handleMouseLeave = () => {
        setReproduciendo(false);
    };

    const handleGameImageClick = (id) => {
        navigate(`/juego/${id}`);
      };
      
      // Función para manejar el clic en el área del trailer
      const handleTrailerClick = (id) => {
        navigate(`/juego/${id}`);
      };
    
    const renderVideo = (nombreJuego) => {
        switch (nombreJuego) {
            case "Stardew Valley":
                return <video src={stardew_valley_vid} className='trailer' autoPlay muted loop />;
            case "Dark Souls III":
                return <video src={dark_souls_vid} className='trailer' autoPlay muted loop />;
            case "Dead by Daylight":
                return <video src={dbd_vid} className='trailer' autoPlay muted loop />;
            case "Elden Ring":
                return <video src={elden_ring_vid} className='trailer' autoPlay muted loop />;
            case "Fall Guys":
                return <video src={fall_guys_vid} className='trailer' autoPlay muted loop />;
            case "Grand Theft Auto V":
                return <video src={gtav_vid} className='trailer' autoPlay muted loop />;
            case "League of Legends":
                return <video src={lol_vid} className='trailer' autoPlay muted loop />;
            case "Red Dead Redemption 2":
                return <video src={read_dead_dedemption_vid} className='trailer' autoPlay muted loop />;
            case "Sea of Thieves":
                return <video src={sea_of_thieves_vid} className='trailer' autoPlay muted loop />;
            case "Valorant":
                return <video src={valorant_vid} className='trailer' autoPlay muted loop />;
            case "Inazuma Eleven: Heroes Victory Road":
                return <video src={victory_road_vid} className='trailer' autoPlay muted loop />;
            case "Fórmula 1 2024":
                return <video src={f1} className='trailer' autoPlay muted loop />;
            default:
                return null;
        }
    };

    return (
        <div className="juego-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => handleTrailerClick(juego.id)}>
            {reproduciendo && renderVideo(juego.nombre)}
        </div>
    );
};

export default JuegoConTrailer;
