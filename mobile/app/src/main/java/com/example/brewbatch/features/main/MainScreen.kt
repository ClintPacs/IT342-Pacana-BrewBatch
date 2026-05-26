package com.example.brewbatch.features.main

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.brewbatch.features.dashboard.DashboardScreen
import com.example.brewbatch.features.inventory.InventoryScreen
import com.example.brewbatch.features.orders.OrdersScreen
import com.example.brewbatch.features.alerts.AlertsScreen
import com.example.brewbatch.features.suppliers.SuppliersScreen
import com.example.brewbatch.shared.network.SessionManager
import com.example.brewbatch.shared.ui.*

// Navigation tab items
sealed class BottomTab(val route: String, val label: String, val emoji: String) {
    object Dashboard  : BottomTab("dashboard",  "Dashboard",  "🏠")
    object Inventory  : BottomTab("inventory",  "Inventory",  "📦")
    object Orders     : BottomTab("orders",     "Orders",     "🛒")
    object Alerts     : BottomTab("alerts",     "Alerts",     "🔔")
    object Suppliers  : BottomTab("suppliers",  "Suppliers",  "🚚")
}

val allTabs = listOf(
    BottomTab.Dashboard,
    BottomTab.Inventory,
    BottomTab.Orders,
    BottomTab.Alerts,
    BottomTab.Suppliers
)

@Composable
fun MainScreen(
    sessionManager: SessionManager,
    onLogout: () -> Unit
) {
    var currentTab by remember { mutableStateOf<BottomTab>(BottomTab.Dashboard) }

    Column(modifier = Modifier.fillMaxSize().background(Milk)) {

        // ── Top bar ──────────────────────────────────────────────────────────
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Roast)
                .statusBarsPadding()
                .padding(horizontal = 16.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                "☕ BrewBatch",
                color = Color.White,
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp,
                modifier = Modifier.weight(1f)
            )
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

        // ── Page content ──────────────────────────────────────────────────────
        Box(modifier = Modifier.weight(1f)) {
            when (currentTab) {
                BottomTab.Dashboard -> DashboardScreen(sessionManager = sessionManager, onLogout = {})
                BottomTab.Inventory -> InventoryScreen(sessionManager = sessionManager)
                BottomTab.Orders    -> OrdersScreen(sessionManager = sessionManager)
                BottomTab.Alerts    -> AlertsScreen(sessionManager = sessionManager)
                BottomTab.Suppliers -> SuppliersScreen(sessionManager = sessionManager)
            }
        }

        // ── Bottom navigation bar ─────────────────────────────────────────────
        Surface(
            modifier = Modifier.fillMaxWidth(),
            shadowElevation = 12.dp,
            color = Color.White
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .navigationBarsPadding()
                    .padding(vertical = 6.dp),
                horizontalArrangement = Arrangement.SpaceAround
            ) {
                allTabs.forEach { tab ->
                    val isSelected = currentTab == tab
                    Column(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(10.dp))
                            .clickable { currentTab = tab }
                            .padding(vertical = 6.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (isSelected) Cream else Color.Transparent),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(tab.emoji, fontSize = 16.sp)
                        }
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            tab.label,
                            fontSize = 9.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                            color = if (isSelected) Coffee else Mocha
                        )
                    }
                }
            }
        }
    }
}
