package com.example.brewbatch

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
import com.example.brewbatch.network.RegisterRequest
import com.example.brewbatch.network.RetrofitClient
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun RegisterScreen(
    onRegisterSuccess: () -> Unit,
    onGoLogin: () -> Unit
) {
    val scope = rememberCoroutineScope()
    var fullName by remember { mutableStateOf("") }
    var username by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirm by remember { mutableStateOf("") }
    var showPassword by remember { mutableStateOf(false) }
    var showConfirm by remember { mutableStateOf(false) }
    var errorMsg by remember { mutableStateOf("") }
    var success by remember { mutableStateOf(false) }
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
            Text("☕", fontSize = 36.sp)
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                "Create Account",
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = Dark
            )
            Text("Join the BrewBatch team", fontSize = 12.sp, color = Mocha)
            Spacer(modifier = Modifier.height(20.dp))

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
                            Text("⚠ $errorMsg", color = ErrorRed, fontSize = 11.sp)
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                    }

                    // Success box
                    if (success) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(SuccessBg, RoundedCornerShape(7.dp))
                                .padding(10.dp)
                        ) {
                            Text(
                                "✓ Account created! Redirecting to login...",
                                color = SuccessGreen,
                                fontSize = 11.sp
                            )
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                    }

                    // Full Name
                    BrewLabel("FULL NAME")
                    BrewInput(
                        value = fullName,
                        onValueChange = { fullName = it },
                        placeholder = "Jane Doe",
                        isSuccess = success
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    // Username
                    BrewLabel("USERNAME")
                    BrewInput(
                        value = username,
                        onValueChange = { username = it },
                        placeholder = "barista01",
                        isSuccess = success
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    // Email
                    BrewLabel("EMAIL")
                    BrewInput(
                        value = email,
                        onValueChange = { email = it },
                        placeholder = "barista@brewbatch.com",
                        isSuccess = success
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    // Password
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        BrewLabel("PASSWORD")
                        Spacer(modifier = Modifier.width(6.dp))
                        Box(
                            modifier = Modifier
                                .background(Caramel, RoundedCornerShape(10.dp))
                                .padding(horizontal = 7.dp, vertical = 2.dp)
                        ) {
                            Text("≥8", fontSize = 9.sp, color = Dark, fontWeight = FontWeight.Bold)
                        }
                    }
                    BrewInput(
                        value = password,
                        onValueChange = { password = it },
                        placeholder = "••••••••",
                        isPassword = true,
                        showPassword = showPassword,
                        onTogglePassword = { showPassword = !showPassword },
                        isSuccess = success
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    // Confirm Password
                    BrewLabel("CONFIRM PASSWORD")
                    BrewInput(
                        value = confirm,
                        onValueChange = { confirm = it },
                        placeholder = "••••••••",
                        isPassword = true,
                        showPassword = showConfirm,
                        onTogglePassword = { showConfirm = !showConfirm },
                        isSuccess = success
                    )
                    Spacer(modifier = Modifier.height(16.dp))

                    // Button
                    Button(
                        onClick = {
                            errorMsg = ""
                            if (fullName.isEmpty() || username.isEmpty() ||
                                email.isEmpty() || password.isEmpty() || confirm.isEmpty()) {
                                errorMsg = "All fields are required"
                                return@Button
                            }
                            if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                                errorMsg = "Enter a valid email address"
                                return@Button
                            }
                            if (password.length < 8) {
                                errorMsg = "Password must be at least 8 characters"
                                return@Button
                            }
                            if (password != confirm) {
                                errorMsg = "Passwords do not match"
                                return@Button
                            }
                            loading = true
                            scope.launch {
                                try {
                                    val response = RetrofitClient.api.register(
                                        RegisterRequest(username, fullName, email, password)
                                    )
                                    if (response.isSuccessful) {
                                        success = true
                                        delay(1500)
                                        onRegisterSuccess()
                                    } else {
                                        errorMsg = "Username or email already taken"
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
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (success) SuccessGreen else Coffee
                        ),
                        enabled = !loading && !success
                    ) {
                        Text(
                            if (success) "✓ Account Created!"
                            else if (loading) "Creating..."
                            else "Create Account",
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))
            Row {
                Text("Already have an account? ", fontSize = 12.sp, color = Coffee)
                Text(
                    "Sign in",
                    fontSize = 12.sp,
                    color = Coffee,
                    textDecoration = TextDecoration.Underline,
                    modifier = Modifier.clickable { onGoLogin() }
                )
            }
        }
    }
}