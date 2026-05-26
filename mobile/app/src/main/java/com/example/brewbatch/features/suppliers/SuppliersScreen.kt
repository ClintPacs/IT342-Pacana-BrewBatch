package com.example.brewbatch.features.suppliers

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
fun SuppliersScreen(sessionManager: SessionManager) {
    val scope     = rememberCoroutineScope()
    var suppliers by remember { mutableStateOf<List<Supplier>>(emptyList()) }
    var loading   by remember { mutableStateOf(true) }
    var search    by remember { mutableStateOf("") }

    // Modal
    var showModal  by remember { mutableStateOf(false) }
    var editItem   by remember { mutableStateOf<Supplier?>(null) }
    var saving     by remember { mutableStateOf(false) }
    var formError  by remember { mutableStateOf("") }

    // Form fields
    var fName    by remember { mutableStateOf("") }
    var fEmail   by remember { mutableStateOf("") }
    var fPhone   by remember { mutableStateOf("") }
    var fAddress by remember { mutableStateOf("") }
    var fContact by remember { mutableStateOf("") }

    fun resetForm(s: Supplier? = null) {
        editItem = s
        fName    = s?.name ?: ""
        fEmail   = s?.email ?: ""
        fPhone   = s?.phone ?: ""
        fAddress = s?.address ?: ""
        fContact = s?.contactPerson ?: ""
        formError = ""
        showModal = true
    }

    fun load() {
        val token = sessionManager.getToken() ?: return
        loading = true
        scope.launch {
            try {
                val resp = RetrofitClient.api.getSuppliers("Bearer $token")
                suppliers = resp.body()?.data ?: emptyList()
            } catch (_: Exception) {}
            loading = false
        }
    }

    LaunchedEffect(Unit) { load() }

    val filtered = suppliers.filter {
        search.isBlank() ||
                it.name.contains(search, ignoreCase = true) ||
                it.email.contains(search, ignoreCase = true) ||
                it.contactPerson.contains(search, ignoreCase = true)
    }

    Column(modifier = Modifier.fillMaxSize().background(Milk)) {

        // ── Page header ───────────────────────────────────────────────────────
        Box(modifier = Modifier.fillMaxWidth().background(Roast).padding(16.dp)) {
            Column {
                Text("🚚  Suppliers", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Text("Manage your supply partners", color = Latte, fontSize = 12.sp)
            }
        }

        Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {

            // Stat card
            BrewStatCard(
                "Total Suppliers",
                suppliers.size.toString(),
                "🚚",
                modifier = Modifier.fillMaxWidth().padding(bottom = 14.dp)
            )

            // Search
            OutlinedTextField(
                value = search,
                onValueChange = { search = it },
                placeholder = { Text("Search suppliers…", color = Latte, fontSize = 13.sp) },
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
            Spacer(modifier = Modifier.height(10.dp))

            // Add button
            Button(
                onClick = { resetForm() },
                modifier = Modifier.fillMaxWidth().height(44.dp),
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Coffee)
            ) { Text("+ Add Supplier", fontWeight = FontWeight.Bold, fontSize = 14.sp) }

            Spacer(modifier = Modifier.height(14.dp))

            if (loading) {
                BrewLoader()
            } else if (filtered.isEmpty()) {
                BrewEmpty("No suppliers found", "Add your first supply partner.", "🚚")
            } else {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(filtered, key = { it.id }) { s ->
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(10.dp),
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            elevation = CardDefaults.cardElevation(3.dp)
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    // Avatar circle
                                    Box(
                                        modifier = Modifier
                                            .size(42.dp)
                                            .background(Coffee, RoundedCornerShape(50)),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            s.name.firstOrNull()?.uppercase() ?: "?",
                                            color = Color.White,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 16.sp
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(12.dp))
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(s.name, fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = Dark)
                                        Text(s.email, fontSize = 11.sp, color = Mocha)
                                    }
                                    BrewBadge(if (s.active) "ACTIVE" else "INACTIVE")
                                }
                                Spacer(modifier = Modifier.height(10.dp))
                                BrewDivider()
                                Spacer(modifier = Modifier.height(8.dp))
                                Row(modifier = Modifier.fillMaxWidth()) {
                                    SupplierDetail("Phone",   s.phone.ifBlank { "—" },   modifier = Modifier.weight(1f))
                                    SupplierDetail("Contact", s.contactPerson.ifBlank { "—" }, modifier = Modifier.weight(1f))
                                }
                                if (s.address.isNotBlank()) {
                                    Spacer(modifier = Modifier.height(6.dp))
                                    SupplierDetail("Address", s.address)
                                }
                                Spacer(modifier = Modifier.height(10.dp))
                                OutlinedButton(
                                    onClick = { resetForm(s) },
                                    modifier = Modifier.fillMaxWidth().height(36.dp),
                                    shape = RoundedCornerShape(6.dp),
                                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Coffee)
                                ) { Text("✏ Edit Supplier", fontSize = 12.sp) }
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
                    modifier = Modifier.padding(20.dp).verticalScroll(rememberScrollState())
                ) {
                    Text(
                        if (editItem != null) "Edit Supplier" else "Add Supplier",
                        fontSize = 17.sp, fontWeight = FontWeight.Bold, color = Dark
                    )
                    Spacer(modifier = Modifier.height(16.dp))

                    if (formError.isNotEmpty()) {
                        Box(modifier = Modifier.fillMaxWidth().background(ErrorBg, RoundedCornerShape(8.dp)).padding(10.dp)) {
                            Text("⚠ $formError", color = ErrorRed, fontSize = 12.sp)
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                    }

                    BrewLabel("SUPPLIER NAME")
                    OutlinedTextField(
                        value = fName, onValueChange = { fName = it },
                        modifier = Modifier.fillMaxWidth().height(50.dp), singleLine = true,
                        colors = brewFieldColors(), shape = RoundedCornerShape(8.dp)
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    BrewLabel("EMAIL")
                    OutlinedTextField(
                        value = fEmail, onValueChange = { fEmail = it },
                        modifier = Modifier.fillMaxWidth().height(50.dp), singleLine = true,
                        colors = brewFieldColors(), shape = RoundedCornerShape(8.dp)
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    BrewLabel("PHONE")
                    OutlinedTextField(
                        value = fPhone, onValueChange = { fPhone = it },
                        modifier = Modifier.fillMaxWidth().height(50.dp), singleLine = true,
                        colors = brewFieldColors(), shape = RoundedCornerShape(8.dp)
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    BrewLabel("CONTACT PERSON")
                    OutlinedTextField(
                        value = fContact, onValueChange = { fContact = it },
                        modifier = Modifier.fillMaxWidth().height(50.dp), singleLine = true,
                        colors = brewFieldColors(), shape = RoundedCornerShape(8.dp)
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    BrewLabel("ADDRESS")
                    OutlinedTextField(
                        value = fAddress, onValueChange = { fAddress = it },
                        modifier = Modifier.fillMaxWidth().height(80.dp),
                        maxLines = 3,
                        colors = brewFieldColors(), shape = RoundedCornerShape(8.dp)
                    )
                    Spacer(modifier = Modifier.height(18.dp))

                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        OutlinedButton(
                            onClick = { showModal = false },
                            modifier = Modifier.weight(1f).height(44.dp),
                            shape = RoundedCornerShape(8.dp)
                        ) { Text("Cancel") }
                        Button(
                            onClick = {
                                if (fName.isBlank() || fEmail.isBlank()) {
                                    formError = "Name and email are required"; return@Button
                                }
                                saving = true
                                scope.launch {
                                    val token = sessionManager.getToken() ?: return@launch
                                    val req = SupplierRequest(fName, fEmail, fPhone, fAddress, fContact)
                                    try {
                                        if (editItem != null) {
                                            RetrofitClient.api.updateSupplier("Bearer $token", editItem!!.id, req)
                                        } else {
                                            RetrofitClient.api.createSupplier("Bearer $token", req)
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
                            else Text(if (editItem != null) "Update" else "Add", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun SupplierDetail(label: String, value: String, modifier: Modifier = Modifier) {
    Column(modifier = modifier.padding(bottom = 2.dp)) {
        Text(label, fontSize = 9.sp, color = Mocha, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(2.dp))
        Text(value, fontSize = 12.sp, color = Dark, fontWeight = FontWeight.Medium)
    }
}
