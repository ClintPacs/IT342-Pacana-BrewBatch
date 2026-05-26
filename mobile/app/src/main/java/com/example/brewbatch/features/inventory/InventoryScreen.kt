package com.example.brewbatch.features.inventory

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import androidx.compose.ui.window.Dialog
import com.example.brewbatch.shared.network.*
import com.example.brewbatch.shared.ui.*
import kotlinx.coroutines.launch

@Composable
fun InventoryScreen(sessionManager: SessionManager) {
    val scope   = rememberCoroutineScope()
    var items   by remember { mutableStateOf<List<InventoryItem>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var search  by remember { mutableStateOf("") }

    // Modal state
    var showModal   by remember { mutableStateOf(false) }
    var showConfirm by remember { mutableStateOf(false) }
    var editItem    by remember { mutableStateOf<InventoryItem?>(null) }
    var archiveId   by remember { mutableStateOf<Long?>(null) }
    var saving      by remember { mutableStateOf(false) }

    // Form
    var fName      by remember { mutableStateOf("") }
    var fCategory  by remember { mutableStateOf("") }
    var fUnit      by remember { mutableStateOf("") }
    var fStock     by remember { mutableStateOf("") }
    var fThreshold by remember { mutableStateOf("") }
    var formError  by remember { mutableStateOf("") }

    fun resetForm(item: InventoryItem? = null) {
        editItem   = item
        fName      = item?.name ?: ""
        fCategory  = item?.category ?: ""
        fUnit      = item?.unit ?: ""
        fStock     = item?.currentStock?.toString() ?: ""
        fThreshold = item?.reorderThreshold?.toString() ?: ""
        formError  = ""
        showModal  = true
    }

    fun load() {
        val token = sessionManager.getToken() ?: return
        loading = true
        scope.launch {
            try {
                val resp = RetrofitClient.api.getInventory("Bearer $token", search.ifBlank { null })
                items = resp.body()?.data ?: emptyList()
            } catch (_: Exception) {}
            loading = false
        }
    }

    LaunchedEffect(search) { load() }

    val filtered = items.filter {
        search.isBlank() || it.name.contains(search, ignoreCase = true) ||
                it.category.contains(search, ignoreCase = true)
    }
    val lowCount = items.count { it.currentStock <= it.reorderThreshold }

    Column(modifier = Modifier.fillMaxSize().background(Milk)) {

        // ── Page header ───────────────────────────────────────────────────────
        Box(
            modifier = Modifier.fillMaxWidth().background(Roast).padding(16.dp)
        ) {
            Column {
                Text("📦  Inventory", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Text("Manage your stock levels", color = Latte, fontSize = 12.sp)
            }
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {

            // ── Stats row ─────────────────────────────────────────────────────
            Row(
                modifier = Modifier.fillMaxWidth().padding(bottom = 14.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                BrewStatCard("Total Items", items.size.toString(), "📦", modifier = Modifier.weight(1f))
                BrewStatCard(
                    "Low Stock", lowCount.toString(), "⚠️",
                    modifier = Modifier.weight(1f),
                    valueColor = if (lowCount > 0) ErrorRed else Dark
                )
            }

            // ── Search bar ────────────────────────────────────────────────────
            OutlinedTextField(
                value = search,
                onValueChange = { search = it },
                placeholder = { Text("Search items…", color = Latte, fontSize = 13.sp) },
                modifier = Modifier.fillMaxWidth().height(50.dp),
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor     = Coffee,
                    unfocusedBorderColor   = Cream,
                    focusedContainerColor  = Color.White,
                    unfocusedContainerColor= Milk,
                    focusedTextColor       = Dark,
                    unfocusedTextColor     = Dark
                ),
                shape = RoundedCornerShape(8.dp)
            )

            Spacer(modifier = Modifier.height(12.dp))

            // ── Add button ────────────────────────────────────────────────────
            Button(
                onClick = { resetForm() },
                modifier = Modifier.fillMaxWidth().height(44.dp),
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Coffee)
            ) {
                Text("+ Add Item", fontWeight = FontWeight.Bold, fontSize = 14.sp)
            }

            Spacer(modifier = Modifier.height(14.dp))

            // ── Item list ─────────────────────────────────────────────────────
            if (loading) {
                BrewLoader()
            } else if (filtered.isEmpty()) {
                BrewEmpty("No inventory items", "Add your first supply item.", "📦")
            } else {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(filtered, key = { it.id }) { item ->
                        val isLow = item.currentStock <= item.reorderThreshold
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(10.dp),
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            elevation = CardDefaults.cardElevation(3.dp)
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                // Header row
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
                                    BrewBadge(if (isLow) "LOW STOCK" else "IN STOCK")
                                }
                                Spacer(modifier = Modifier.height(8.dp))
                                BrewDivider()
                                Spacer(modifier = Modifier.height(8.dp))
                                // Detail row
                                Row(modifier = Modifier.fillMaxWidth()) {
                                    InventoryDetailItem("Stock", "${item.currentStock} ${item.unit}",
                                        valueColor = if (isLow) ErrorRed else Dark, modifier = Modifier.weight(1f))
                                    InventoryDetailItem("Threshold", item.reorderThreshold.toString(), modifier = Modifier.weight(1f))
                                    InventoryDetailItem("Unit", item.unit, modifier = Modifier.weight(1f))
                                }
                                Spacer(modifier = Modifier.height(10.dp))
                                // Action buttons
                                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    OutlinedButton(
                                        onClick = { resetForm(item) },
                                        modifier = Modifier.weight(1f).height(36.dp),
                                        shape = RoundedCornerShape(6.dp),
                                        border = ButtonDefaults.outlinedButtonBorder.copy(width = 1.5.dp),
                                        colors = ButtonDefaults.outlinedButtonColors(contentColor = Coffee)
                                    ) { Text("✏ Edit", fontSize = 12.sp) }
                                    OutlinedButton(
                                        onClick = { archiveId = item.id; showConfirm = true },
                                        modifier = Modifier.weight(1f).height(36.dp),
                                        shape = RoundedCornerShape(6.dp),
                                        border = ButtonDefaults.outlinedButtonBorder.copy(width = 1.5.dp),
                                        colors = ButtonDefaults.outlinedButtonColors(contentColor = ErrorRed)
                                    ) { Text("🗄 Archive", fontSize = 12.sp) }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // ── Add / Edit modal ─────────────────────────────────────────────────────
    if (showModal) {
        Dialog(onDismissRequest = { if (!saving) showModal = false }) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(8.dp)
            ) {
                Column(
                    modifier = Modifier
                        .padding(20.dp)
                        .verticalScroll(rememberScrollState())
                ) {
                    Text(
                        if (editItem != null) "Edit Item" else "Add Item",
                        fontSize = 17.sp,
                        fontWeight = FontWeight.Bold,
                        color = Dark
                    )
                    Spacer(modifier = Modifier.height(16.dp))

                    if (formError.isNotEmpty()) {
                        Box(
                            modifier = Modifier.fillMaxWidth().background(ErrorBg, RoundedCornerShape(8.dp)).padding(10.dp)
                        ) { Text("⚠ $formError", color = ErrorRed, fontSize = 12.sp) }
                        Spacer(modifier = Modifier.height(10.dp))
                    }

                    BrewLabel("ITEM NAME")
                    OutlinedTextField(
                        value = fName, onValueChange = { fName = it },
                        modifier = Modifier.fillMaxWidth().height(50.dp), singleLine = true,
                        colors = brewFieldColors(), shape = RoundedCornerShape(8.dp)
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    BrewLabel("CATEGORY")
                    OutlinedTextField(
                        value = fCategory, onValueChange = { fCategory = it },
                        modifier = Modifier.fillMaxWidth().height(50.dp), singleLine = true,
                        colors = brewFieldColors(), shape = RoundedCornerShape(8.dp)
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    BrewLabel("UNIT")
                    OutlinedTextField(
                        value = fUnit, onValueChange = { fUnit = it },
                        modifier = Modifier.fillMaxWidth().height(50.dp), singleLine = true,
                        colors = brewFieldColors(), shape = RoundedCornerShape(8.dp)
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Column(modifier = Modifier.weight(1f)) {
                            BrewLabel("CURRENT STOCK")
                            OutlinedTextField(
                                value = fStock, onValueChange = { fStock = it },
                                modifier = Modifier.fillMaxWidth().height(50.dp), singleLine = true,
                                colors = brewFieldColors(), shape = RoundedCornerShape(8.dp)
                            )
                        }
                        Column(modifier = Modifier.weight(1f)) {
                            BrewLabel("THRESHOLD")
                            OutlinedTextField(
                                value = fThreshold, onValueChange = { fThreshold = it },
                                modifier = Modifier.fillMaxWidth().height(50.dp), singleLine = true,
                                colors = brewFieldColors(), shape = RoundedCornerShape(8.dp)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(18.dp))

                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        OutlinedButton(
                            onClick = { showModal = false },
                            modifier = Modifier.weight(1f).height(44.dp),
                            shape = RoundedCornerShape(8.dp)
                        ) { Text("Cancel") }
                        Button(
                            onClick = {
                                if (fName.isBlank() || fCategory.isBlank() || fUnit.isBlank() ||
                                    fStock.isBlank() || fThreshold.isBlank()) {
                                    formError = "All fields are required"; return@Button
                                }
                                val stock = fStock.toDoubleOrNull()
                                val thresh = fThreshold.toDoubleOrNull()
                                if (stock == null || thresh == null) {
                                    formError = "Stock and threshold must be numbers"; return@Button
                                }
                                saving = true
                                scope.launch {
                                    val token = sessionManager.getToken() ?: return@launch
                                    val req = InventoryRequest(fName, fCategory, fUnit, stock, thresh)
                                    try {
                                        if (editItem != null) {
                                            RetrofitClient.api.updateInventoryItem("Bearer $token", editItem!!.id, req)
                                        } else {
                                            RetrofitClient.api.createInventoryItem("Bearer $token", req)
                                        }
                                        showModal = false
                                        load()
                                    } catch (_: Exception) { formError = "Failed to save" }
                                    saving = false
                                }
                            },
                            modifier = Modifier.weight(1f).height(44.dp),
                            shape = RoundedCornerShape(8.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Coffee),
                            enabled = !saving
                        ) {
                            if (saving) CircularProgressIndicator(color = Color.White, strokeWidth = 2.dp, modifier = Modifier.size(18.dp))
                            else Text(if (editItem != null) "Update" else "Create", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }

    // ── Archive confirm dialog ────────────────────────────────────────────────
    if (showConfirm) {
        AlertDialog(
            onDismissRequest = { showConfirm = false },
            title = { Text("Archive Item", fontWeight = FontWeight.Bold, color = Dark) },
            text = { Text("This item will be hidden from active inventory. Continue?", color = Mocha, fontSize = 13.sp) },
            confirmButton = {
                Button(
                    onClick = {
                        val id = archiveId ?: return@Button
                        scope.launch {
                            val token = sessionManager.getToken() ?: return@launch
                            try {
                                RetrofitClient.api.archiveInventoryItem("Bearer $token", id)
                                showConfirm = false
                                load()
                            } catch (_: Exception) {}
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = ErrorRed)
                ) { Text("Archive") }
            },
            dismissButton = {
                OutlinedButton(onClick = { showConfirm = false }) { Text("Cancel") }
            },
            containerColor = Color.White,
            shape = RoundedCornerShape(14.dp)
        )
    }
}

@Composable
fun InventoryDetailItem(label: String, value: String, valueColor: Color = Dark, modifier: Modifier = Modifier) {
    Column(modifier = modifier) {
        Text(label, fontSize = 9.sp, color = Mocha, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(2.dp))
        Text(value, fontSize = 12.sp, color = valueColor, fontWeight = FontWeight.SemiBold)
    }
}
