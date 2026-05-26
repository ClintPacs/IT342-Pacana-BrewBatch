package com.example.brewbatch.features.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.brewbatch.shared.network.LoginRequest
import com.example.brewbatch.shared.network.RetrofitClient
import com.example.brewbatch.shared.network.SessionManager
import com.example.brewbatch.shared.ui.*
import kotlinx.coroutines.launch

// ── Color aliases for backward compatibility with any files importing from this package ──
val Espresso     = com.example.brewbatch.shared.ui.Espresso
val Dark         = com.example.brewbatch.shared.ui.Dark
val Roast        = com.example.brewbatch.shared.ui.Roast
val Coffee       = com.example.brewbatch.shared.ui.Coffee
val Mocha        = com.example.brewbatch.shared.ui.Mocha
val Caramel      = com.example.brewbatch.shared.ui.Caramel
val Latte        = com.example.brewbatch.shared.ui.Latte
val Cream        = com.example.brewbatch.shared.ui.Cream
val Milk         = com.example.brewbatch.shared.ui.Milk
val ErrorRed     = com.example.brewbatch.shared.ui.ErrorRed
val ErrorBg      = com.example.brewbatch.shared.ui.ErrorBg
val SuccessGreen = com.example.brewbatch.shared.ui.SuccessGreen
val SuccessBg    = com.example.brewbatch.shared.ui.SuccessBg

@Composable
fun LoginScreen(
    sessionManager: SessionManager,
    onLoginSuccess: () -> Unit,
    onGoRegister: () -> Unit
) {
    val scope = rememberCoroutineScope()
    var username     by remember { mutableStateOf("") }
    var password     by remember { mutableStateOf("") }
    var showPassword by remember { mutableStateOf(false) }
    var errorMsg     by remember { mutableStateOf("") }
    var loading      by remember { mutableStateOf(false) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(com.example.brewbatch.shared.ui.Milk),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .verticalScroll(rememberScrollState())
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Logo
            Text("☕", fontSize = 52.sp)
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                "BrewBatch",
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                color = com.example.brewbatch.shared.ui.Dark
            )
            Text(
                "Sign in to your account",
                fontSize = 13.sp,
                color = com.example.brewbatch.shared.ui.Mocha
            )
            Spacer(modifier = Modifier.height(28.dp))

            // Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(8.dp)
            ) {
                Column(modifier = Modifier.padding(24.dp)) {

                    // Error box
                    if (errorMsg.isNotEmpty()) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(com.example.brewbatch.shared.ui.ErrorBg, RoundedCornerShape(8.dp))
                                .padding(12.dp)
                        ) { Text("⚠ $errorMsg", color = com.example.brewbatch.shared.ui.ErrorRed, fontSize = 12.sp) }
                        Spacer(modifier = Modifier.height(14.dp))
                    }

                    // Username
                    BrewLabel("USERNAME")
                    BrewInput(
                        value = username,
                        onValueChange = { username = it },
                        placeholder = "barista01",
                        isError = errorMsg.isNotEmpty()
                    )
                    Spacer(modifier = Modifier.height(14.dp))

                    // Password
                    BrewLabel("PASSWORD")
                    BrewInput(
                        value = password,
                        onValueChange = { password = it },
                        placeholder = "••••••••",
                        isError = errorMsg.isNotEmpty(),
                        isPassword = true,
                        showPassword = showPassword,
                        onTogglePassword = { showPassword = !showPassword }
                    )
                    Spacer(modifier = Modifier.height(20.dp))

                    BrewButton(
                        text = if (loading) "Signing in…" else "Sign In",
                        onClick = {
                            if (username.isEmpty() || password.isEmpty()) {
                                errorMsg = "Please fill in all fields"; return@BrewButton
                            }
                            errorMsg = ""
                            loading = true
                            scope.launch {
                                try {
                                    val response = RetrofitClient.api.login(LoginRequest(username, password))
                                    if (response.isSuccessful) {
                                        val token = response.body()?.data?.token
                                        val user  = response.body()?.data?.user
                                        if (token != null) {
                                            sessionManager.saveToken(token)
                                            sessionManager.saveUsername(user?.username ?: username)
                                            onLoginSuccess()
                                        } else errorMsg = "Login failed — no token received"
                                    } else errorMsg = "Invalid username or password"
                                } catch (_: Exception) { errorMsg = "Cannot connect to server" }
                                finally { loading = false }
                            }
                        },
                        loading = loading
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))
            Row {
                Text(
                    "Don't have an account? ",
                    fontSize = 13.sp,
                    color = com.example.brewbatch.shared.ui.Coffee
                )
                Text(
                    "Register here",
                    fontSize = 13.sp,
                    color = com.example.brewbatch.shared.ui.Coffee,
                    textDecoration = TextDecoration.Underline,
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.clickable { onGoRegister() }
                )
            }
        }
    }
}