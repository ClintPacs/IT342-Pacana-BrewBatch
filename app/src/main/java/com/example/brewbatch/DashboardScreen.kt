package com.example.brewbatch

import androidx.compose.foundation.background
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.brewbatch.network.RetrofitClient
import com.example.brewbatch.network.SessionManager
import com.google.gson.Gson
import kotlinx.coroutines.launch

@Composable
fun DashboardScreen(
    sessionManager: SessionManager,
    onLogout: () -> Unit
) {
    val scope = rememberCoroutineScope()
    var username by remember { mutableStateOf(sessionManager.getUsername() ?: "user") }
    var fullName by remember { mutableStateOf("—") }
    var email by remember { mutableStateOf("—") }
    var role by remember { mutableStateOf("—") }
    var userId by remember { mutableStateOf("—") }
    var loading by remember { mutableStateOf(true) }

    fun loadProfile() {
        val token = sessionManager.getToken() ?: return
        scope.launch {
            try {
                val response = RetrofitClient.api.getMe("Bearer $token")
                if (response.isSuccessful) {
                    val json = Gson().toJsonTree(response.body()).asJsonObject
                    val data = if (json.has("data") && !json.get("data").isJsonNull)
                        json.getAsJsonObject("data") else json
                    username = data.get("username")?.asString ?: username
                    fullName = data.get("fullName")?.asString ?: "—"
                    email = data.get("email")?.asString ?: "—"
                    role = data.get("role")?.asString ?: "—"
                    userId = "#${data.get("id")?.asLong ?: 0}"
                } else {
                    onLogout()
                }
            } catch (e: Exception) {
                // keep showing cached username
            } finally {
                loading = false
            }
        }
    }

    LaunchedEffect(Unit) { loadProfile() }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Milk)
    ) {
        // Top Nav
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Roast)
                .padding(horizontal = 16.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                "☕ BrewBatch",
                color = Color.White,
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp,
                modifier = Modifier.weight(1f)
            )
            TextButton(
                onClick = { loading = true; loadProfile() },
                colors = ButtonDefaults.textButtonColors(contentColor = Color.White)
            ) { Text("↺", fontSize = 14.sp) }
            Spacer(modifier = Modifier.width(6.dp))
            Button(
                onClick = {
                    sessionManager.clearToken()
                    onLogout()
                },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFB91C1C)),
                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp),
                modifier = Modifier.height(34.dp)
            ) { Text("Logout", fontSize = 11.sp, fontWeight = FontWeight.Bold) }
        }

        // Content
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            // Welcome
            Text(
                "Welcome, $username ☕",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = Dark,
                modifier = Modifier.padding(bottom = 14.dp)
            )

            // Stat Cards
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 14.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                StatCard("ROLE", role, Modifier.weight(1f))
                StatCard("USER ID", userId, Modifier.weight(1f))
                StatCard("STATUS", "● Active", Modifier.weight(1f), valueColor = SuccessGreen)
            }

            // Profile Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(10.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(4.dp)
            ) {
                Column {
                    // Header
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Cream)
                            .padding(10.dp)
                    ) {
                        Text(
                            "👤  Profile",
                            color = Coffee,
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp
                        )
                    }

                    if (loading) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(24.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            CircularProgressIndicator(color = Coffee, strokeWidth = 2.dp)
                        }
                    } else {
                        ProfileRow("USERNAME", username)
                        Divider(color = Cream)
                        ProfileRow("FULL NAME", fullName)
                        Divider(color = Cream)
                        ProfileRow("EMAIL", email)
                        Divider(color = Cream)
                        ProfileRow("ROLE", role, isBadge = true)
                        Divider(color = Cream)
                        ProfileRow("USER ID", userId, valueColor = Mocha)
                    }
                }
            }
        }
    }
}

@Composable
fun StatCard(label: String, value: String, modifier: Modifier, valueColor: Color = Dark) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(3.dp)
    ) {
        Column(modifier = Modifier.padding(10.dp)) {
            Text(label, fontSize = 8.sp, color = Mocha, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(4.dp))
            Text(value, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = valueColor)
        }
    }
}

@Composable
fun ProfileRow(key: String, value: String, isBadge: Boolean = false, valueColor: Color = Dark) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 14.dp, vertical = 11.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            key,
            modifier = Modifier.width(90.dp),
            fontSize = 10.sp,
            color = Mocha,
            fontWeight = FontWeight.Bold
        )
        if (isBadge) {
            Box(
                modifier = Modifier
                    .background(Cream, RoundedCornerShape(20.dp))
                    .padding(horizontal = 8.dp, vertical = 3.dp)
            ) {
                Text(value, fontSize = 10.sp, color = Coffee, fontWeight = FontWeight.Bold)
            }
        } else {
            Text(value, fontSize = 13.sp, color = valueColor, fontWeight = FontWeight.Medium)
        }
    }
}