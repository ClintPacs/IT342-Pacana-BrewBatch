package com.example.brewbatch

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.brewbatch.network.RetrofitClient
import com.example.brewbatch.network.SessionManager
import com.example.brewbatch.network.LoginRequest
import kotlinx.coroutines.launch

// ── Colors ────────────────────────────────────────────────────────────────────
val Espresso = Color(0xFF1A0800)
val Dark = Color(0xFF2E1503)
val Roast = Color(0xFF4A2008)
val Coffee = Color(0xFF6B3A1F)
val Mocha = Color(0xFF8B5E3C)
val Caramel = Color(0xFFC4874A)
val Latte = Color(0xFFD9B896)
val Cream = Color(0xFFF2E4D0)
val Milk = Color(0xFFFAF4EC)
val ErrorRed = Color(0xFFC0392B)
val ErrorBg = Color(0xFFFEF2F2)
val SuccessGreen = Color(0xFF27AE60)
val SuccessBg = Color(0xFFF0FDF4)

@Composable
fun LoginScreen(
    sessionManager: SessionManager,
    onLoginSuccess: () -> Unit,
    onGoRegister: () -> Unit
) {
    val scope = rememberCoroutineScope()
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var showPassword by remember { mutableStateOf(false) }
    var errorMsg by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Milk),
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
            Text("☕", fontSize = 44.sp)
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                "BrewBatch",
                fontSize = 26.sp,
                fontWeight = FontWeight.Bold,
                color = Dark
            )
            Text(
                "Sign in to your account",
                fontSize = 13.sp,
                color = Mocha
            )
            Spacer(modifier = Modifier.height(24.dp))

            // Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(6.dp)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {

                    // Error box
                    if (errorMsg.isNotEmpty()) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(ErrorBg, RoundedCornerShape(7.dp))
                                .padding(10.dp)
                        ) {
                            Text("⚠ $errorMsg", color = ErrorRed, fontSize = 12.sp)
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                    }

                    // Username
                    BrewLabel("USERNAME")
                    BrewInput(
                        value = username,
                        onValueChange = { username = it },
                        placeholder = "barista01",
                        isError = errorMsg.isNotEmpty()
                    )
                    Spacer(modifier = Modifier.height(12.dp))

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
                    Spacer(modifier = Modifier.height(16.dp))

                    // Loading dots
                    if (loading) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.Center
                        ) {
                            Text("Signing in...", color = Latte, fontSize = 12.sp)
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                    }

                    // Button
                    Button(
                        onClick = {
                            if (username.isEmpty() || password.isEmpty()) {
                                errorMsg = "Please fill in all fields"
                                return@Button
                            }
                            errorMsg = ""
                            loading = true
                            scope.launch {
                                try {
                                    val response = RetrofitClient.api.login(
                                        LoginRequest(username, password)
                                    )
                                    if (response.isSuccessful) {
                                        val body = response.body()
                                        body?.token?.let { token ->
                                            sessionManager.saveToken(token)
                                            sessionManager.saveUsername(body.username ?: username)
                                            onLoginSuccess()
                                        }
                                    } else {
                                        errorMsg = "Invalid username or password"
                                    }
                                } catch (e: Exception) {
                                    errorMsg = "Cannot connect to server"
                                } finally {
                                    loading = false
                                }
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Coffee),
                        enabled = !loading
                    ) {
                        Text(
                            if (loading) "Signing in..." else "Sign In",
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))
            Row {
                Text("Don't have an account? ", fontSize = 12.sp, color = Coffee)
                Text(
                    "Register here",
                    fontSize = 12.sp,
                    color = Coffee,
                    textDecoration = TextDecoration.Underline,
                    modifier = Modifier.clickable { onGoRegister() }
                )
            }
        }
    }
}

@Composable
fun BrewLabel(text: String) {
    Text(
        text,
        fontSize = 10.sp,
        fontWeight = FontWeight.Bold,
        color = Coffee,
        letterSpacing = 0.08.sp,
        modifier = Modifier.padding(bottom = 4.dp)
    )
}

@Composable
fun BrewInput(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    isError: Boolean = false,
    isSuccess: Boolean = false,
    isPassword: Boolean = false,
    showPassword: Boolean = false,
    onTogglePassword: (() -> Unit)? = null
) {
    val borderColor = when {
        isError -> ErrorRed
        isSuccess -> SuccessGreen
        else -> Cream
    }
    val bgColor = when {
        isError -> ErrorBg
        isSuccess -> SuccessBg
        else -> Milk
    }
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        placeholder = { Text(placeholder, color = Latte, fontSize = 13.sp) },
        modifier = Modifier
            .fillMaxWidth()
            .height(50.dp),
        singleLine = true,
        visualTransformation = if (isPassword && !showPassword)
            PasswordVisualTransformation() else VisualTransformation.None,
        trailingIcon = if (isPassword && onTogglePassword != null) {
            { Text(
                if (showPassword) "🙈" else "👁",
                modifier = Modifier
                    .clickable { onTogglePassword() }
                    .padding(end = 8.dp),
                fontSize = 14.sp
            ) }
        } else null,
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = Coffee,
            unfocusedBorderColor = borderColor,
            focusedContainerColor = Color.White,
            unfocusedContainerColor = bgColor,
            focusedTextColor = Dark,
            unfocusedTextColor = Dark
        ),
        shape = RoundedCornerShape(8.dp)
    )
}