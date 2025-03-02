import React, { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import "./CustomAudioPlayer.css";

const CustomAudioPlayer = ({ src, name, showName = false }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Atualiza a progressão do círculo
  const updateProgress = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 1;
      setProgress((currentTime / duration) * 100);
    }
  };

  // Alterna entre play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Atualiza a progressão do círculo enquanto a música toca
  useEffect(() => {
    const interval = setInterval(updateProgress, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="custom-audio-player">
      {/* Exibe o nome da música se showName for true */}
      {showName && <p className="music-name">{name}</p>}

      {/* Botão Play/Pause dentro do círculo */}
      <div className="progress-circle" onClick={togglePlay}>
        <svg viewBox="0 0 36 36">
          <path
            className="bg"
            d="M18 2.0845
               a 15.9155 15.9155 0 1 1 0 31.831
               a 15.9155 15.9155 0 1 1 0 -31.831"
          />
          <path
            className="progress"
            strokeDasharray={`${progress}, 100`}
            d="M18 2.0845
               a 15.9155 15.9155 0 1 1 0 31.831
               a 15.9155 15.9155 0 1 1 0 -31.831"
          />
        </svg>
        {/* Ícone de Play/Pause dentro do círculo */}
        <div className="play-icon">
          {isPlaying ? <FaPause /> : <FaPlay />}
        </div>
      </div>

      {/* Elemento de Áudio */}
      <audio ref={audioRef} src={src} onEnded={() => setIsPlaying(false)} />
    </div>
  );
};

export default CustomAudioPlayer;
