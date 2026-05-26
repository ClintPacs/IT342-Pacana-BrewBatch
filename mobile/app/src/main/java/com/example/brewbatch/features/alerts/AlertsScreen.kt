package com.example.brewbatch.features.alerts

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.brewbatch.shared.network.*
import com.example.brewbatch.shared.ui.*
import kotlinx.coroutines.launch

@Composable
fun AlertsScreen(sessionManager: SessionManager) {
    val scope   = rememberCoroutineScope()
    var alerts  by remember { mutableStateOf<List<InventoryItem>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var error   by remember { mutableStateOf("") }

    fun load() {
        val token = sessionManager.getToken() ?: return
        loading = true
        error   = ""
        scope.launch {
            try {
                val resp = RetrofitClient.api.getInventoryAlerts("Bearer $token")
                alerts = resp.body()?.data ?: emptyList()
            } catch (_: Exception) { error = "Failed to load alerts" }
            loading = false
        }
    }

    LaunchedEffect(Unit) { load() }

    Column(modifier = Modifier.fillMaxSize().background(Milk)) {

        // ── Page header ───────────────────────────────────────────────────────
        Box(modifier = Modifier.fillMaxWidth().background(Roast).padding(16.dp)) {
            Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                Column(modifier = Modifier.weight(1f)) {
                    Text("🔔  Low Stock Alerts", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    Text("Items that need to be restocked", color = Latte, fontSize = 12.sp)
                }
                IconButton(onClick = { load() }) {
                    Text("↺", color = Color.White, fontSize = 20.sp)
                }
            }
        }

        Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {

            // Summary card
            Card(
                modifier = Modifier.fillMaxWidth().padding(bottom = 14.dp),
                shape = RoundedCornerShape(10.dp),
                colors = CardDefaults.cardColors(
                    containerColor = if (alerts.isEmpty()) SuccessBg else ErrorBg
                ),
                elevation = CardDefaults.cardElevation(2.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(if (alerts.isEmpty()) "✅" else "⚠️", fontSize = 28.sp)
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            if (loading) "Loading…"
                            else if (alerts.isEmpty()) "All items are well-stocked"
                            else "${alerts.size} item${if (alerts.size > 1) "s" else ""} need restocking",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (alerts.isEmpty()) SuccessGreen else ErrorRed
                        )
                        Text(
                            "Last refreshed just now",
                            fontSize = 11.sp,
                            color = if (alerts.isEmpty()) SuccessGreen else ErrorRed
                        )
                    }
                }
            }

            // Error
            if (error.isNotEmpty()) {
                Box(
                    modifier = Modifier.fillMaxWidth().background(ErrorBg, RoundedCornerShape(8.dp)).padding(12.dp)
                ) { Text("⚠ $error", color = ErrorRed, fontSize = 13.sp) }
                Spacer(modifier = Modifier.height(12.dp))
            }

            if (loading) {
                BrewLoader()
            } else if (alerts.isEmpty()) {
                BrewEmpty("No low stock alerts", "All inventory items are sufficiently stocked.", "✅")
            } else {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(alerts, key = { it.id }) { item ->
                        val pctLeft = if (item.reorderThreshold > 0)
                            (item.currentStock / item.reorderThreshold).coerceAtMost(1.0).toFloat()
                        else 0f

                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(10.dp),
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            elevation = CardDefaults.cardElevation(3.dp)
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            item.name,
                                            fontSize = 14.sp,
                                            fontWeight = FontWeight.SemiBold,
                                            color = Dark
                                        )
                                        Text(
                                            item.category,
                                            fontSize = 11.sp,
                                            color = Mocha
                                        )
                                    }
                                    BrewBadge("LOW STOCK")
                                }
                                Spacer(modifier = Modifier.height(10.dp))

                                // Stock progress bar
                                LinearProgressIndicator(
                                    progress = { pctLeft },
                                    modifier = Modifier.fillMaxWidth().height(6.dp),
                                    color = ErrorRed,
                                    trackColor = Cream
                                )
                                Spacer(modifier = Modifier.height(8.dp))

                                Row(modifier = Modifier.fillMaxWidth()) {
                                    AlertDetailItem(
                                        "Current Stock",
                                        "${item.currentStock} ${item.unit}",
                                        valueColor = ErrorRed,
                                        modifier = Modifier.weight(1f)
                                    )
                                    AlertDetailItem(
                                        "Threshold",
                                        "${item.reorderThreshold} ${item.unit}",
                                        modifier = Modifier.weight(1f)
                                    )
                                    AlertDetailItem(
                                        "Deficit",
                                        "${(item.reorderThreshold - item.currentStock).coerceAtLeast(0.0)} ${item.unit}",
                                        valueColor = ErrorRed,
                                        modifier = Modifier.weight(1f)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun AlertDetailItem(label: String, value: String, valueColor: Color = Dark, modifier: Modifier = Modifier) {
    Column(modifier = modifier) {
        Text(label, fontSize = 9.sp, color = Mocha, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(2.dp))
        Text(value, fontSize = 12.sp, color = valueColor, fontWeight = FontWeight.SemiBold)
    }
}
