package com.example.brewbatch

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.*
import com.example.brewbatch.network.SessionManager

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        val session = SessionManager(this)

        setContent {
            var screen by remember {
                mutableStateOf(
                    if (session.isLoggedIn()) "dashboard" else "login"
                )
            }

            when (screen) {
                "login" -> LoginScreen(
                    sessionManager = session,
                    onLoginSuccess = { screen = "dashboard" },
                    onGoRegister = { screen = "register" }
                )
                "register" -> RegisterScreen(
                    onRegisterSuccess = { screen = "login" },
                    onGoLogin = { screen = "login" }
                )
                "dashboard" -> DashboardScreen(
                    sessionManager = session,
                    onLogout = { screen = "login" }
                )
            }
        }
    }
}