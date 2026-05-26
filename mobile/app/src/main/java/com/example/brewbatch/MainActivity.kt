package com.example.brewbatch

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.*
import com.example.brewbatch.features.auth.LoginScreen
import com.example.brewbatch.features.auth.RegisterScreen
import com.example.brewbatch.features.main.MainScreen
import com.example.brewbatch.shared.network.SessionManager

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        val session = SessionManager(this)

        setContent {
            var screen by remember {
                mutableStateOf(
                    if (session.isLoggedIn()) "main" else "login"
                )
            }

            when (screen) {
                "login" -> LoginScreen(
                    sessionManager = session,
                    onLoginSuccess = { screen = "main" },
                    onGoRegister = { screen = "register" }
                )
                "register" -> RegisterScreen(
                    onRegisterSuccess = { screen = "login" },
                    onGoLogin = { screen = "login" }
                )
                "main" -> MainScreen(
                    sessionManager = session,
                    onLogout = { screen = "login" }
                )
            }
        }
    }
}