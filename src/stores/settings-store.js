import { defineStore, acceptHMRUpdate } from 'pinia'

const THEMES = ['panini', 'terrace', 'cruzeiro']
const STORAGE_KEY = '7a0:theme'

function applyTheme(theme) {
  if (typeof document === 'undefined') return
  const html = document.documentElement
  THEMES.forEach((t) => html.classList.remove(`theme-${t}`))
  html.classList.add(`theme-${theme}`)
}

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: 'cruzeiro',
  }),

  actions: {
    init() {
      const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      this.theme = THEMES.includes(saved) ? saved : 'panini'
      applyTheme(this.theme)
    },

    setTheme(theme) {
      if (!THEMES.includes(theme)) return
      this.theme = theme
      applyTheme(theme)
      if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, theme)
    },

    toggleTheme() {
      this.setTheme(this.theme === 'cruzeiro' ? 'terrace' : 'cruzeiro')
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}
