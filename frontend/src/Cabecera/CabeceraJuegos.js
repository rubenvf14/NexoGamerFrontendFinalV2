import React, { useState, useEffect } from 'react';
import './CabeceraJuegos.css'; // Importa el archivo de estilos CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import JuegoConTrailer from '../JuegoConTrailer/JuegoConTrailer'; // Importa el componente JuegoConTrailer

function CabeceraJuegos() {
  const [fondoUrl, setFondoUrl] = useState('');
  const [indiceImagen, setIndiceImagen] = useState(0);
  const [juegos, setJuegos] = useState([]);
  const [opacity, setOpacity] = useState(0); // Estado para la opacidad de la imagen de fondo
  const [imageLoading, setImageLoading] = useState(true); // Estado para controlar la carga de la imagen
  const [reproduciendo, setReproduciendo] = useState(false); // Estado para controlar la reproducción del trailer

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/juegos', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener los juegos del backend');
        }
        const data = await response.json();
        setJuegos(data);
        console.log(data);
        if (data.length > 0 && !fondoUrl) {
          setFondoUrl(data[0].urlImagen); // Establece la primera imagen
        }
      } catch (error) {
        console.error('Error al obtener los juegos del backend:', error);
      }
    };
  
    fetchData();
  }, []); // Ejecuta una vez al montar el componente
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (juegos.length > 0) {
        const nextIndex = (indiceImagen + 1) % juegos.length;
        setIndiceImagen(nextIndex);
      }
    }, 5000);
  
    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
  }, [indiceImagen, juegos]); // Ejecuta cada vez que indiceImagen o juegos cambian
  
  useEffect(() => {
    if (juegos.length > 0) {
      setImageLoading(true); // Mostrar indicador de carga
      setOpacity(0); // Cambia la opacidad a 0
      setTimeout(() => {
        setFondoUrl(juegos[indiceImagen].urlImagen);
        setOpacity(1); // Cambia la opacidad a 1 después de que cambie la imagen
        setImageLoading(false); // Ocultar indicador de carga
      }, 500); // Espera 500 ms antes de cambiar la imagen para que la transición sea visible
    }
  }, [indiceImagen, juegos]); // Ejecuta cada vez que indiceImagen o juegos cambian

  const handleMouseEnter = () => {
    setReproduciendo(true);
  };

  const handleMouseLeave = () => {
    setReproduciendo(false);
  };

  return (
    <>
      <div className='cabeceraJuegos'>
        <div className='fondo-container'>
          {/* Imagen de fondo con transición de opacidad */}
          <img
            src={fondoUrl}
            alt='imagen'
            className='fondo-imagen'
            style={{ opacity: opacity }} // Aplica la opacidad dinámica
            width='100%'
          />
          {/* Botones redondos */}
          <div className='botones-container'>
            {juegos.map((juego, index) => (
              <button
                key={juego.id}
                onClick={() => setIndiceImagen(index)}
                className={indiceImagen === index ? 'boton-activo' : 'boton-inactivo'}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="generalBody">
        <h1 className='tendencias'>Tendencias <FontAwesomeIcon className="flecha" icon={icon({ name: 'chevron-right', family: 'classic', style: 'solid' })} /></h1>
        <div className="carteleraJuegos">
          {juegos.map((juego, key) => (
            <div className='juego' key={key}>
              <div className='miniCartelera' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                {reproduciendo && <JuegoConTrailer juego={juego} />} {/* Muestra el trailer si se está reproduciendo */}
                <div className='contenedorImagen'>
                  <img src={juego.urlImagen} alt='foto' className='miniCarteleras'></img>
                  {juego.rebaja !== 0 && <div className='etiquetaNaranja'>-{juego.rebaja}%</div>}
              </div>
              </div>
              <div className='texto'>
                  <p className='nombre'>{juego.nombre}</p>
                  {juego.precio === "0.00" ? <p className="precio">Gratuito</p> : <p className="precio">{(juego.precio - (juego.precio * (juego.rebaja / 100))).toFixed(2)}€</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default CabeceraJuegos;
