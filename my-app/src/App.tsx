import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import './App.css'

function App() {
  const [name, setName] = useState(() => {
    const savedName = localStorage.getItem('userName')
    return savedName || ''
  })
  const [selectedTime, setSelectedTime] = useState(10)
  const [timeRemaining, setTimeRemaining] = useState(selectedTime)
  const [isRunning, setIsRunning] = useState(false)
  const [isFirst, setIsFirst] = useState(true)
  const [userCount, setUserCount] = useState(() => {
    const savedCount = localStorage.getItem('userCount')
    return savedCount ? parseInt(savedCount) : 0
  })
  const phrases = [
    "Ты справишься!",
    "Вперёд к цели!",
    "Не сдавайся!",
    "Каждый шаг — прогресс",
    "Сделай это ради себя",
    "Ты сильнее, чем думаешь"
  ];
  
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else if (timeRemaining === 0) {
      setIsRunning(false)
    }
  }, [isRunning, timeRemaining])

  useEffect(() => {
    if (name.trim()) {
      localStorage.setItem('userName', name)
    }
  }, [name])

  useEffect(() => {
    localStorage.setItem('userCount', userCount.toString())
  }, [userCount])

  const startTimer = () => {
    setUserCount(prev => prev + 1)
    setIsRunning(true)
    setIsFirst(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeRemaining(selectedTime)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleTimeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newTime = parseInt(event.target.value)
    setSelectedTime(newTime)
    setTimeRemaining(newTime)
  }

  const progressPercentage = ((selectedTime - timeRemaining) / selectedTime) * 100

  return (
    <div className="app-container">
      <div className="input-section">
        <input 
          type="text" 
          placeholder='Введите своё имя' 
          value={name} 
          onChange={handleChange}
        />
        <small className="attempt-counter">
          Попыток: {userCount}
        </small>
      </div>
      
      <div className="timer-settings">
        <label>
          Выберите время:
          <select value={selectedTime} onChange={handleTimeChange} disabled={isRunning}>
            <option value={10}>10 секунд</option>
            <option value={20}>20 секунд</option>
            <option value={30}>30 секунд</option>
          </select>
        </label>
      </div>

      {timeRemaining === 0 && (
        <h2 className="success-message">
          {phrases[Math.floor(Math.random() * phrases.length)]}, {name}!
        </h2>
      )}

      <div className="timer-controls">
        <p>{isRunning && `${name}, осталось ${timeRemaining} секунд`}</p>
        {isRunning && (
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
        <div className="button-group">
          <button 
            onClick={startTimer} 
            disabled={isRunning || timeRemaining === 0}
            className="primary-button"
          >
            {isFirst ? 'Старт таймера' : 'Попробуйте ещё раз'}
          </button>
          <button onClick={resetTimer} className="secondary-button">
            Сброс
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
