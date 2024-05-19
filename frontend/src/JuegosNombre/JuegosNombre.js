import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import logo from "../nexoGamerFinal.png";
import CabeceraGlobal from '../CabeceraGlobal/CabeceraGlobal';
import JuegoConTrailer from '../JuegoConTrailer/JuegoConTrailer';
import "./JuegosNombre.css";
import { Link, useNavigate } from 'react-router-dom';
import basura from "./basura.png";

const JuegosNombre = () => {
    const [juegos, setJuego] = useState([]);
    const parametro = useParams();
    const [plataformas, setPlataformas] = useState([]);
    const [reproduciendo, setReproduciendo] = useState(false);
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState('');
    const [generos, setGeneros] = useState([]);
    const [consolas, setConsolas] = useState([]);
    const [generoSeleccionado, setGeneroSeleccionado] = useState('Cualquiera');
    const [juegosFiltrados, setJuegosFiltrados] = useState([]);
    const [consolaSeleccionada, setConsolaSeleccionada] = useState('Todas');
    const [plataformaSeleccionada, setPlataformaSeleccionada] = useState('Todas');
    const [años, setAños] = useState([]);
    const [añoSeleccionado, setAñoSeleccionado] = useState('Cualquiera');
    const [precioMin, setPrecioMin] = useState(0);
    const [precioMax, setPrecioMax] = useState(100);
    const [showAnimation, setShowAnimation] = useState(false);
    const [aplicandoFiltros, setAplicandoFiltros] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseJuegos = await fetch(`http://localhost:8000/juegosNombre?nombre=${parametro.juego}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!responseJuegos.ok) {
                    throw new Error('Error al obtener los juegos del backend');
                }

                const dataJuegos = await responseJuegos.json();

                const generosSet = new Set();
                const consolasSet = new Set();
                const plataformasSet = new Set();
                const añosSet = new Set();

                dataJuegos.forEach(juego => {
                    juego.genero.split('/').forEach(genre => {
                        generosSet.add(genre.trim());
                    });
                    juego.consola.split('/').forEach(system => {
                        consolasSet.add(system.trim());
                    });
                    juego.plataforma.split('/').forEach(platform => {
                        plataformasSet.add(platform.trim());
                    });
                    
                    const añoJuego = parseInt(juego.fechaSalida);
                    añosSet.add(añoJuego);
                });

                const generosArray = ['Cualquiera', ...Array.from(generosSet)];
                const consolasArray = ['Todas', ...Array.from(consolasSet)];
                const plataformasArray = ['Todas', ...Array.from(plataformasSet)];
                const añosArray = ['Cualquiera', ...Array.from(añosSet)];

                setGeneros(generosArray);
                setConsolas(consolasArray);
                setPlataformas(plataformasArray);
                setAños(añosArray);

                setJuego(dataJuegos);
                setJuegosFiltrados(dataJuegos);
            } catch (error) {
                console.error('Error al obtener datos del backend:', error);
            }
        };

        fetchData();
    }, [parametro.juego]);

    useEffect(() => {
        const filterJuegos = () => {
            let juegosFiltradosTemp = juegos;
    
            // Filtrar los juegos según los criterios seleccionados
            if (generoSeleccionado !== 'Cualquiera') {
                juegosFiltradosTemp = juegosFiltradosTemp.filter(juego => juego.genero.includes(generoSeleccionado));
            }
    
            if (consolaSeleccionada !== 'Todas') {
                juegosFiltradosTemp = juegosFiltradosTemp.filter(juego => juego.consola.includes(consolaSeleccionada));
            }
    
            if (plataformaSeleccionada !== 'Todas' && plataformaSeleccionada !== '') {
                juegosFiltradosTemp = juegosFiltradosTemp.filter(juego => juego.plataforma.includes(plataformaSeleccionada));
            }
    
            if (añoSeleccionado !== 'Cualquiera' && añoSeleccionado !== '') {
                juegosFiltradosTemp = juegosFiltradosTemp.filter(juego => parseInt(juego.fechaSalida) === parseInt(añoSeleccionado));
            }
    
            juegosFiltradosTemp = juegosFiltradosTemp.filter(juego => {
                const precioActual = juego.precio - (juego.precio * (juego.rebaja / 100));
                return precioActual >= precioMin && precioActual <= precioMax;
            });
    
            // Verificar si los juegos filtrados son diferentes a los juegos anteriores
            const juegosDiferentes = JSON.stringify(juegosFiltradosTemp) !== JSON.stringify(juegosFiltrados);
    
            // Actualizar los juegos filtrados
            setJuegosFiltrados(juegosFiltradosTemp);
    
            // Activar la animación si los juegos filtrados son diferentes o si se están eliminando los filtros
            if (juegosDiferentes) {
                setShowAnimation(true);
                const timer = setTimeout(() => {
                    setShowAnimation(false);
                }, 500);
                return () => clearTimeout(timer);
            }
        };
    
        filterJuegos();
    }, [generoSeleccionado, consolaSeleccionada, plataformaSeleccionada, añoSeleccionado, precioMin, precioMax, juegos]);
    
    
    useEffect(() => {
        if (juegosFiltrados.length > 0) {
            setShowAnimation(true);
            const timer = setTimeout(() => {
                setShowAnimation(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [juegosFiltrados]);


    const handlePlataformaChange = (event) => {
        setPlataformaSeleccionada(event.target.value);
    };

    const handleBusqueda = () => {
        if (busqueda.trim() !== '') {
            navigate(`/juegosNombre/${busqueda}`);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleBusqueda();
        }
    };

    const handleSearchButtonClick = () => {
        handleBusqueda();
    };

    const handleReset = () => {
        setGeneroSeleccionado('Cualquiera');
        setConsolaSeleccionada('Todas');
        setPlataformaSeleccionada('Todas');
        setAñoSeleccionado('Cualquiera');
        setJuegosFiltrados(juegos);
        resetearPrecios();
    };

    // Manejador de eventos para actualizar el precio mínimo
    const handlePrecioMinChange = (event) => {
        setPrecioMin(event.target.value);
    };
    
    // Manejador de eventos para actualizar el precio máximo
    const handlePrecioMaxChange = (event) => {
        setPrecioMax(event.target.value);
    };

    const resetearPrecios = () => {
        setPrecioMin(0);
        setPrecioMax(100);
    };

    return (
        <div className='generalContainer'>
            <CabeceraGlobal />
            <div className='desplegables'>
                <div className='inputContainer'>
                    <div className='inputNames'>
                        <h3>Sistemas</h3>
                    </div>
                    <select value={consolaSeleccionada} onChange={(e) => setConsolaSeleccionada(e.target.value)}>
                        {consolas.map((consola, index) => (
                            <option className="opciones" key={index} value={consola}>{consola}</option>
                        ))}
                    </select>
                </div>
                <div className='inputContainer'>
                    <div className='inputNames'>
                        <h3>Plataformas</h3>
                    </div>
                    <select value={plataformaSeleccionada} onChange={handlePlataformaChange}>
                        {plataformas.map((plat, index) => (
                            <option className='opciones' key={index} value={plat}>{plat}</option>
                        ))}
                    </select>
                </div>
                <div className='inputContainer'>
                    <div className='inputNames'>
                        <h3>Géneros</h3>
                    </div>
                    <select value={generoSeleccionado} onChange={(e) => setGeneroSeleccionado(e.target.value)}>
                        {generos.map((genero, index) => (
                            <option className="opciones" key={index} value={genero}>{genero}</option>
                        ))}
                    </select>
                </div>
                <div className='inputContainer'>
                    <div className='inputNames'>
                        <h3>Año</h3>
                    </div>
                    <select value={añoSeleccionado} onChange={(e) => setAñoSeleccionado(e.target.value)}>
                        {años.map((año, index) => (
                            <option className='opciones' key={index} value={año}>{año}</option>
                        ))}
                    </select>
                </div>
                <div className='trash' onClick={handleReset}>
                    <img src={basura} alt='basura'></img>
                    <p>Eliminar filtros</p>
                </div>
            </div>
            <div className='precio'>
                <p>Entre</p>
                <input type='number' id='number1' placeholder='0' value={precioMin} onChange={handlePrecioMinChange}></input>
                <p>y</p>
                <input type='number' id='number2' placeholder='100' value={precioMax} onChange={handlePrecioMaxChange}></input>
                <p>€</p>
            </div>
            <div className='generalBody'>
                <div className='carteleraJuegos'>
                    {juegosFiltrados.length === 0 ? (
                        <p>No hay juegos con los filtros seleccionados</p>
                    ) : (
                        juegosFiltrados.map((juego, key) => (
                            <div className={`juego ${showAnimation ? 'fade-in' : ''}`} key={key}>
                                <div className='miniCartelera' onMouseEnter={() => setReproduciendo(true)} onMouseLeave={() => setReproduciendo(false)}>
                                    {reproduciendo && <JuegoConTrailer juego={juego} />}
                                    <div className='contenedorImagen'>
                                        <img src={juego.urlImagen} alt='foto' className='miniCarteleras' />
                                        {juego.rebaja !== 0 && <div className='etiquetaNaranja'>-{juego.rebaja}%</div>}
                                    </div>
                                </div>
                                <div className='texto'>
                                    <p className='nombre'>{juego.nombre.length > 20 ? juego.nombre.substring(0, 20) + '...' : juego.nombre}</p>
                                    {juego.precio === "0.00" ? <p className="precio">Gratuito</p> : <p className="precio">{(juego.precio - (juego.precio * (juego.rebaja / 100))).toFixed(2)}€</p>}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div className="footer">
                <div className="leftFooter">
                    <Link to="/">Aviso legal</Link>
                    <Link to="/">Cookies</Link>
                </div>
                <div className="rightFooter">
                    <Link to="/"><img src={logo} alt="logo" className="miniLogo"></img></Link>
                    <Link to="/" className="sin-subrayado"><h2>NEXOGAMER</h2></Link>
                </div>
            </div>
        </div>
    );
}       

export default JuegosNombre;
