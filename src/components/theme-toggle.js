import React, { useState, useEffect } from 'react'

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    // 저장된 테마 또는 시스템 선호도 확인
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light')
    setTheme(initialTheme)
    document.documentElement.setAttribute('data-theme', initialTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`${theme === 'light' ? '다크' : '라이트'} 모드로 전환`}
      title={`${theme === 'light' ? '다크' : '라이트'} 모드로 전환`}
    >
      <span className="theme-toggle-icon">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
    </button>
  )
}

export default ThemeToggle