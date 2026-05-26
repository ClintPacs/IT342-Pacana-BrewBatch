package com.example.brewbatch.features.dashboard

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
import com.example.brewbatch.shared.network.*
import com.example.brewbatch.shared.ui.*
import com.google.gson.Gson
import kotlinx.coroutines.launch

@Composable
fun DashboardScreen(
    sessionManager: SessionManager,
    onLogout: () -> Unit
) {
    val scope = rememberCoroutineScope()
    var username   by remember { mutableStateOf(sessionManager.getUsername() ?: "user") }
    var fullName   by remember { mutableStateOf("—") }
    var email      by remember { mutableStateOf("—") }
    var role       by remember { mutableStateOf("—") }
    var profileLoading by remember { mutableStateOf(true) }

    // Stats
    var inventoryCount  by remember { mutableStateOf("…") }
    var alertCount      by remember { mutableStateOf("…") }
    var orderCount      by remember { mutableStateOf("…") }
    var supplierCount   by remember { mutableStateOf("…") }

    // Recent orders + alerts
    var recentOrders    by remember { mutableStateOf<List<Order>>(emptyList()) }
    var lowStockAlerts  by remember { mutableStateOf<List<InventoryItem>>(emptyList()) }
    var statsLoading    by remember { mutableStateOf(true) }

    fun greet(): String {
        val h = java.util.Calendar.getInstance().get(java.util.Calendar.HOUR_OF_DAY)
        return when {
            h < 12 -> "Good morning"
            h < 18 -> "Good afternoon"
            else   -> "Good evening"
        }
    }

    fun loadAll() {
        val token = sessionManager.getToken() ?: return
        val bearer = "Bearer $token"
        profileLoading = true
        statsLoading   = true
        scope.launch {
            // Profile
            try {
                val resp = RetrofitClient.api.getMe(bearer)
                if (resp.isSuccessful) {
                    val json = Gson().toJsonTree(resp.body()).asJsonObject
                    val data = if (json.has("data") && !json.get("data").isJsonNull)
                        json.getAsJsonObject("data") else json
                    username = data.get("username")?.asString ?: username
                    fullName = data.get("fullName")?.asString ?: "—"
                    email    = data.get("email")?.asString ?: "—"
                    role     = data.get("role")?.asString ?: "—"
                }
            } catch (_: Exception) {}
            profileLoading = false
        }
        scope.launch {
            // Inventory count
            try {
                val resp = RetrofitClient.api.getInventory(bearer)
                inventoryCount = resp.body()?.data?.size?.toString() ?: "0"
            } catch (_: Exception) { inventoryCount = "—" }
        }
        scope.launch {
            // Low-stock alerts
            try {
                val resp = RetrofitClient.api.getInventoryAlerts(bearer)
                val list = resp.body()?.data ?: emptyList()
                lowStockAlerts = list
                alertCount = list.size.toString()
            } catch (_: Exception) { alertCount = "—" }
        }
        scope.launch {
            // Orders
            try {
                val resp = RetrofitClient.api.getOrders(bearer)
                val list = resp.body()?.data ?: emptyList()
                recentOrders = list.take(5)
                orderCount   = list.count { it.status == "PENDING" }.toString()
            } catch (_: Exception) { orderCount = "—" }
        }
        scope.launch {
            // Suppliers
            try {
                val resp = RetrofitClient.api.getSuppliers(bearer)
                supplierCount = resp.body()?.data?.size?.toString() ?: "0"
            } catch (_: Exception) { supplierCount = "—" }
            statsLoading = false
        }
    }

    LaunchedEffect(Unit) { loadAll() }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Milk)
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        // Greeting
        if (profileLoading) {
            Spacer(modifier = Modifier.height(4.dp))
            LinearProgressIndicator(
                color = Coffee,
                trackColor = Cream,
                modifier = Modifier.fillMaxWidth().height(2.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))
        } else {
            Column(modifier = Modifier.padding(bottom = 16.dp)) {
                Text(
                    "${greet()}, ${fullName.ifBlank { username }} 👋",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Dark
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    java.text.SimpleDateFormat(
                        "EEEE, MMMM d, yyyy",
                        java.util.Locale.getDefault()
                    ).format(java.util.Date()),
                    fontSize = 12.sp,
                    color = Mocha
                )
            }
        }

        // ── Stat cards 2×2 ───────────────────────────────────────────────────
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            BrewStatCard("Total Items",    inventoryCount, "📦", modifier = Modifier.weight(1f))
            BrewStatCard("Low Stock",      alertCount,     "⚠️", modifier = Modifier.weight(1f),
                valueColor = if (alertCount != "0" && alertCount != "…") ErrorRed else Dark)
        }
        Spacer(modifier = Modifier.height(10.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            BrewStatCard("Open Orders",    orderCount,    "🛒", modifier = Modifier.weight(1f))
            BrewStatCard("Suppliers",      supplierCount, "🚚", modifier = Modifier.weight(1f))
        }

        Spacer(modifier = Modifier.height(20.dp))

        // ── Recent orders ────────────────────────────────────────────────────
        Text(
            "Recent Orders",
            fontSize = 15.sp,
            fontWeight = FontWeight.Bold,
            color = Dark,
            modifier = Modifier.padding(bottom = 10.dp)
        )
        BrewCard {
            if (statsLoading) {
                Box(
                    modifier = Modifier.fillMaxWidth().padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = Coffee, strokeWidth = 2.dp)
                }
            } else if (recentOrders.isEmpty()) {
                BrewEmpty("No orders yet", "Place your first order", "🛒")
            } else {
                Column {
                    recentOrders.forEachIndexed { idx, order ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 14.dp, vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    "#${order.id} · ${order.item}",
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = Dark
                                )
                                Text(
                                    order.supplier,
                                    fontSize = 11.sp,
                                    color = Mocha
                                )
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            Column(horizontalAlignment = Alignment.End) {
                                BrewBadge(order.status)
                                Spacer(modifier = Modifier.height(3.dp))
                                Text(
                                    "₱${"%,.2f".format(order.totalCost)}",
                                    fontSize = 11.sp,
                                    color = Mocha,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }
                        if (idx < recentOrders.lastIndex) BrewDivider()
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // ── Low stock alerts ─────────────────────────────────────────────────
        Text(
            "Low Stock Alerts",
            fontSize = 15.sp,
            fontWeight = FontWeight.Bold,
            color = Dark,
            modifier = Modifier.padding(bottom = 10.dp)
        )

        if (!statsLoading && lowStockAlerts.isEmpty()) {
            BrewCard {
                Box(
                    modifier = Modifier.fillMaxWidth().padding(20.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text("✅ All items are well-stocked", fontSize = 13.sp, color = Mocha)
                }
            }
        } else {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                if (statsLoading) {
                    repeat(3) {
                        Card(
                            modifier = Modifier.fillMaxWidth().height(60.dp),
                            shape = RoundedCornerShape(10.dp),
                            colors = CardDefaults.cardColors(containerColor = Cream)
                        ) {}
                    }
                } else {
                    lowStockAlerts.take(5).forEach { item ->
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(10.dp),
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            elevation = CardDefaults.cardElevation(3.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth().padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        item.name,
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = Dark
                                    )
                                    Text(
                                        "Stock: ${item.currentStock} ${item.unit}  ·  Threshold: ${item.reorderThreshold}",
                                        fontSize = 11.sp,
                                        color = ErrorRed
                                    )
                                }
                                BrewBadge("LOW STOCK")
                            }
                        }
                    }
                }
            }
        }

        // ── Profile summary card ──────────────────────────────────────────────
        Spacer(modifier = Modifier.height(20.dp))
        Text(
            "My Profile",
            fontSize = 15.sp,
            fontWeight = FontWeight.Bold,
            color = Dark,
            modifier = Modifier.padding(bottom = 10.dp)
        )
        BrewCard {
            Column {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Cream)
                        .padding(10.dp)
                ) {
                    Text("👤  Account Info", color = Coffee, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }
                if (profileLoading) {
                    Box(
                        modifier = Modifier.fillMaxWidth().padding(24.dp),
                        contentAlignment = Alignment.Center
                    ) { CircularProgressIndicator(color = Coffee, strokeWidth = 2.dp) }
                } else {
                    DashProfileRow("USERNAME", username)
                    BrewDivider()
                    DashProfileRow("FULL NAME", fullName)
                    BrewDivider()
                    DashProfileRow("EMAIL", email)
                    BrewDivider()
                    DashProfileRow("ROLE", role, isBadge = true)
                }
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
    }
}

@Composable
fun DashProfileRow(key: String, value: String, isBadge: Boolean = false) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(horizontal = 14.dp, vertical = 11.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(key, modifier = Modifier.width(100.dp), fontSize = 10.sp, color = Mocha, fontWeight = FontWeight.Bold)
        if (isBadge) {
            BrewBadge(value)
        } else {
            Text(value, fontSize = 13.sp, color = Dark, fontWeight = FontWeight.Medium)
        }
    }
}