package com.example.brewbatch.features.orders

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.brewbatch.shared.network.*
import com.example.brewbatch.shared.ui.*
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

private val statusTabs = listOf("ALL", "PENDING", "APPROVED", "RECEIVED", "CANCELLED")

@Composable
fun OrdersScreen(sessionManager: SessionManager) {
    val scope   = rememberCoroutineScope()
    var orders   by remember { mutableStateOf<List<Order>>(emptyList()) }
    var suppliers by remember { mutableStateOf<List<Supplier>>(emptyList()) }
    var loading  by remember { mutableStateOf(true) }
    var activeTab by remember { mutableStateOf("ALL") }

    // New order modal
    var showModal by remember { mutableStateOf(false) }
    var step      by remember { mutableStateOf(1) }
    var selSupplier by remember { mutableStateOf<Supplier?>(null) }
    var fItem     by remember { mutableStateOf("") }
    var fQty      by remember { mutableStateOf("") }
    var fCost     by remember { mutableStateOf("") }
    var saving    by remember { mutableStateOf(false) }
    var formError by remember { mutableStateOf("") }

    // Confirm dialog
    var showConfirm  by remember { mutableStateOf(false) }
    var confirmType  by remember { mutableStateOf("") }   // "cancel" | "delete"
    var confirmId    by remember { mutableStateOf<Long?>(null) }

    fun load(silent: Boolean = false) {
        val token = sessionManager.getToken() ?: return
        if (!silent) loading = true
        scope.launch {
            try {
                val oResp = RetrofitClient.api.getOrders("Bearer $token")
                orders = oResp.body()?.data ?: emptyList()
                val sResp = RetrofitClient.api.getSuppliers("Bearer $token")
                suppliers = sResp.body()?.data ?: emptyList()
            } catch (_: Exception) {}
            loading = false
        }
    }

    LaunchedEffect(Unit) { load() }

    val filtered = if (activeTab == "ALL") orders else orders.filter { it.status == activeTab }
    val counts = statusTabs.associateWith { tab ->
        if (tab == "ALL") orders.size else orders.count { it.status == tab }
    }

    fun formatDate(iso: String?): String {
        if (iso.isNullOrBlank()) return "—"
        return try {
            val sdf = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault())
            val date = sdf.parse(iso) ?: return "—"
            SimpleDateFormat("MMM d, h:mm a", Locale.getDefault()).format(date)
        } catch (_: Exception) { "—" }
    }

    Column(modifier = Modifier.fillMaxSize().background(Milk)) {

        // ── Page header ───────────────────────────────────────────────────────
        Box(modifier = Modifier.fillMaxWidth().background(Roast).padding(16.dp)) {
            Column {
                Text("🛒  Orders", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Text("Purchase order management", color = Latte, fontSize = 12.sp)
            }
        }

        Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {

            // ── New Order button ──────────────────────────────────────────────
            Button(
                onClick = { selSupplier = null; fItem = ""; fQty = ""; fCost = ""; step = 1; formError = ""; showModal = true },
                modifier = Modifier.fillMaxWidth().height(44.dp),
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Coffee)
            ) { Text("+ New Order", fontWeight = FontWeight.Bold, fontSize = 14.sp) }

            Spacer(modifier = Modifier.height(14.dp))

            // ── Status filter tabs ────────────────────────────────────────────
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth().padding(bottom = 14.dp)
            ) {
                items(statusTabs) { tab ->
                    val isActive = tab == activeTab
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(20.dp))
                            .background(if (isActive) Coffee else Color.White)
                            .clickable { activeTab = tab }
                            .padding(horizontal = 14.dp, vertical = 7.dp)
                    ) {
                        Text(
                            "${if (tab == "ALL") "All" else tab.lowercase().replaceFirstChar { it.uppercase() }}  ${counts[tab] ?: 0}",
                            fontSize = 12.sp,
                            fontWeight = if (isActive) FontWeight.Bold else FontWeight.Normal,
                            color = if (isActive) Color.White else Mocha
                        )
                    }
                }
            }

            // ── Order list ────────────────────────────────────────────────────
            if (loading) {
                BrewLoader()
            } else if (filtered.isEmpty()) {
                BrewEmpty("No orders", "Place a new order to get started.", "🛒")
            } else {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(filtered, key = { it.id }) { order ->
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(10.dp),
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            elevation = CardDefaults.cardElevation(3.dp)
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            "#${order.id} · ${order.item}",
                                            fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Dark
                                        )
                                        Text(order.supplier, fontSize = 11.sp, color = Mocha)
                                    }
                                    BrewBadge(order.status)
                                }
                                Spacer(modifier = Modifier.height(8.dp))
                                BrewDivider()
                                Spacer(modifier = Modifier.height(8.dp))
                                Row(modifier = Modifier.fillMaxWidth()) {
                                    OrderDetailItem("Qty", order.quantity.toString(), modifier = Modifier.weight(1f))
                                    OrderDetailItem("Total", "₱${"%,.2f".format(order.totalCost)}", modifier = Modifier.weight(1.5f))
                                    OrderDetailItem("Date", formatDate(order.createdAt), modifier = Modifier.weight(2f))
                                }
                                if (order.status != "CANCELLED" && order.status != "RECEIVED") {
                                    Spacer(modifier = Modifier.height(8.dp))
                                    OutlinedButton(
                                        onClick = { confirmId = order.id; confirmType = "cancel"; showConfirm = true },
                                        modifier = Modifier.fillMaxWidth().height(34.dp),
                                        shape = RoundedCornerShape(6.dp),
                                        colors = ButtonDefaults.outlinedButtonColors(contentColor = WarnAmber)
                                    ) { Text("✕ Cancel Order", fontSize = 12.sp) }
                                } else if (order.status == "CANCELLED") {
                                    Spacer(modifier = Modifier.height(8.dp))
                                    OutlinedButton(
                                        onClick = { confirmId = order.id; confirmType = "delete"; showConfirm = true },
                                        modifier = Modifier.fillMaxWidth().height(34.dp),
                                        shape = RoundedCornerShape(6.dp),
                                        colors = ButtonDefaults.outlinedButtonColors(contentColor = ErrorRed)
                                    ) { Text("🗑 Delete Order", fontSize = 12.sp) }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // ── New Order wizard modal ────────────────────────────────────────────────
    if (showModal) {
        Dialog(onDismissRequest = { if (!saving) showModal = false }) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(8.dp)
            ) {
                Column(modifier = Modifier.padding(20.dp).verticalScroll(rememberScrollState())) {
                    Text("New Order", fontSize = 17.sp, fontWeight = FontWeight.Bold, color = Dark)
                    Spacer(modifier = Modifier.height(12.dp))

                    // Step progress bar
                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        (1..3).forEach { s ->
                            Box(
                                modifier = Modifier.weight(1f).height(4.dp)
                                    .background(if (step >= s) Coffee else Cream, RoundedCornerShape(2.dp))
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))

                    when (step) {
                        // Step 1: Select supplier
                        1 -> {
                            Text("Select Supplier", fontSize = 13.sp, color = Mocha, fontWeight = FontWeight.Medium)
                            Spacer(modifier = Modifier.height(10.dp))
                            if (suppliers.isEmpty()) {
                                Box(
                                    modifier = Modifier.fillMaxWidth().background(Cream, RoundedCornerShape(8.dp)).padding(16.dp),
                                    contentAlignment = Alignment.Center
                                ) { Text("No suppliers registered yet.", color = Mocha, fontSize = 13.sp) }
                            } else {
                                suppliers.forEach { s ->
                                    val isSel = selSupplier?.id == s.id
                                    Card(
                                        modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
                                            .clickable { selSupplier = s; step = 2 },
                                        shape = RoundedCornerShape(8.dp),
                                        border = if (isSel) ButtonDefaults.outlinedButtonBorder.copy(width = 2.dp) else null,
                                        colors = CardDefaults.cardColors(containerColor = if (isSel) Milk else Color.White),
                                        elevation = CardDefaults.cardElevation(if (isSel) 4.dp else 2.dp)
                                    ) {
                                        Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                                            Box(
                                                modifier = Modifier.size(36.dp).background(Coffee, RoundedCornerShape(50)),
                                                contentAlignment = Alignment.Center
                                            ) {
                                                Text(s.name.firstOrNull()?.uppercase() ?: "?", color = Color.White, fontWeight = FontWeight.Bold)
                                            }
                                            Spacer(modifier = Modifier.width(12.dp))
                                            Column {
                                                Text(s.name, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Dark)
                                                Text(s.email, fontSize = 11.sp, color = Mocha)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        // Step 2: Order details
                        2 -> {
                            Box(modifier = Modifier.fillMaxWidth().background(Milk, RoundedCornerShape(8.dp)).padding(10.dp)) {
                                Text("Supplier: ${selSupplier?.name}", fontSize = 13.sp, color = Coffee, fontWeight = FontWeight.Medium)
                            }
                            Spacer(modifier = Modifier.height(12.dp))

                            if (formError.isNotEmpty()) {
                                Box(modifier = Modifier.fillMaxWidth().background(ErrorBg, RoundedCornerShape(8.dp)).padding(10.dp)) {
                                    Text("⚠ $formError", color = ErrorRed, fontSize = 12.sp)
                                }
                                Spacer(modifier = Modifier.height(10.dp))
                            }

                            BrewLabel("ITEM NAME")
                            OutlinedTextField(
                                value = fItem, onValueChange = { fItem = it },
                                modifier = Modifier.fillMaxWidth().height(50.dp), singleLine = true,
                                colors = brewFieldColors(), shape = RoundedCornerShape(8.dp)
                            )
                            Spacer(modifier = Modifier.height(10.dp))
                            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                Column(modifier = Modifier.weight(1f)) {
                                    BrewLabel("QUANTITY")
                                    OutlinedTextField(
                                        value = fQty, onValueChange = { fQty = it },
                                        modifier = Modifier.fillMaxWidth().height(50.dp), singleLine = true,
                                        colors = brewFieldColors(), shape = RoundedCornerShape(8.dp)
                                    )
                                }
                                Column(modifier = Modifier.weight(1f)) {
                                    BrewLabel("TOTAL COST (₱)")
                                    OutlinedTextField(
                                        value = fCost, onValueChange = { fCost = it },
                                        modifier = Modifier.fillMaxWidth().height(50.dp), singleLine = true,
                                        colors = brewFieldColors(), shape = RoundedCornerShape(8.dp)
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.height(16.dp))
                            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                OutlinedButton(onClick = { step = 1 }, modifier = Modifier.weight(1f).height(44.dp), shape = RoundedCornerShape(8.dp)) { Text("Back") }
                                Button(
                                    onClick = {
                                        if (fItem.isBlank() || fQty.isBlank() || fCost.isBlank()) {
                                            formError = "All fields required"; return@Button
                                        }
                                        formError = ""; step = 3
                                    },
                                    modifier = Modifier.weight(1f).height(44.dp),
                                    shape = RoundedCornerShape(8.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = Coffee)
                                ) { Text("Next", fontWeight = FontWeight.Bold) }
                            }
                        }
                        // Step 3: Confirm
                        3 -> {
                            Box(modifier = Modifier.fillMaxWidth().background(Milk, RoundedCornerShape(10.dp)).padding(14.dp)) {
                                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                    ConfirmRow("Supplier", selSupplier?.name ?: "")
                                    ConfirmRow("Email",    selSupplier?.email ?: "")
                                    ConfirmRow("Item",     fItem)
                                    ConfirmRow("Qty",      fQty)
                                    ConfirmRow("Total",    "₱${fCost}")
                                }
                            }
                            Spacer(modifier = Modifier.height(16.dp))
                            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                OutlinedButton(onClick = { step = 2 }, modifier = Modifier.weight(1f).height(44.dp), shape = RoundedCornerShape(8.dp)) { Text("Back") }
                                Button(
                                    onClick = {
                                        saving = true
                                        scope.launch {
                                            val token = sessionManager.getToken() ?: return@launch
                                            try {
                                                RetrofitClient.api.createOrder(
                                                    "Bearer $token",
                                                    OrderRequest(
                                                        supplier = selSupplier?.name ?: "",
                                                        supplierEmail = selSupplier?.email ?: "",
                                                        item = fItem,
                                                        quantity = fQty.toIntOrNull() ?: 0,
                                                        totalCost = fCost.toDoubleOrNull() ?: 0.0
                                                    )
                                                )
                                                showModal = false
                                                load(true)
                                            } catch (_: Exception) {}
                                            saving = false
                                        }
                                    },
                                    modifier = Modifier.weight(1f).height(44.dp),
                                    shape = RoundedCornerShape(8.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = Coffee),
                                    enabled = !saving
                                ) {
                                    if (saving) CircularProgressIndicator(color = Color.White, strokeWidth = 2.dp, modifier = Modifier.size(18.dp))
                                    else Text("Confirm Order", fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // ── Cancel / Delete confirm ───────────────────────────────────────────────
    if (showConfirm) {
        AlertDialog(
            onDismissRequest = { showConfirm = false },
            title = {
                Text(
                    if (confirmType == "cancel") "Cancel Order" else "Delete Order",
                    fontWeight = FontWeight.Bold, color = Dark
                )
            },
            text = {
                Text(
                    if (confirmType == "cancel") "Are you sure you want to cancel this order?"
                    else "Delete this order permanently?",
                    fontSize = 13.sp, color = Mocha
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        val id = confirmId ?: return@Button
                        scope.launch {
                            val token = sessionManager.getToken() ?: return@launch
                            try {
                                if (confirmType == "cancel") RetrofitClient.api.cancelOrder("Bearer $token", id)
                                else RetrofitClient.api.deleteOrder("Bearer $token", id)
                                showConfirm = false
                                load(true)
                            } catch (_: Exception) {}
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = ErrorRed)
                ) { Text("Yes") }
            },
            dismissButton = {
                OutlinedButton(onClick = { showConfirm = false }) { Text("No") }
            },
            containerColor = Color.White,
            shape = RoundedCornerShape(14.dp)
        )
    }
}

@Composable
fun OrderDetailItem(label: String, value: String, modifier: Modifier = Modifier) {
    Column(modifier = modifier) {
        Text(label, fontSize = 9.sp, color = Mocha, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(2.dp))
        Text(value, fontSize = 12.sp, color = Dark, fontWeight = FontWeight.SemiBold)
    }
}

@Composable
fun ConfirmRow(label: String, value: String) {
    Row(modifier = Modifier.fillMaxWidth()) {
        Text(label, fontSize = 12.sp, color = Mocha, modifier = Modifier.width(80.dp))
        Text(value, fontSize = 12.sp, color = Dark, fontWeight = FontWeight.Medium)
    }
}
