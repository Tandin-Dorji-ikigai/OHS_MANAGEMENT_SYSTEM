import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import {
  QueryClientProvider,
} from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import App from './App'

import './index.css'

import queryClient from './api/queryClient'
import {
  AuthProvider,
} from './context/AuthContext'
import {
  NotificationProvider,
} from './context/NotificationContext'

import syncEngine from './offline/syncEngine'
import networkMonitor from './offline/networkMonitor'

networkMonitor.start()

networkMonitor.subscribe((online) => {
  if (online) {
    syncEngine.sync()
  }
})

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#09090b',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                },
              }}
            />
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
