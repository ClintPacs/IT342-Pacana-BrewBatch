package com.example.brewbatch.shared.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// ── Reusable label ────────────────────────────────────────────────────────────
@Composable
fun BrewLabel(text: String) {
    Text(
        text,
        fontSize = 10.sp,
        fontWeight = FontWeight.Bold,
        color = Coffee,
        letterSpacing = 0.6.sp,
        modifier = Modifier.padding(bottom = 4.dp)
    )
}

// ── Reusable text input ───────────────────────────────────────────────────────
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
        isError   -> ErrorRed
        isSuccess -> SuccessGreen
        else      -> Cream
    }
    val bgColor = when {
        isError   -> ErrorBg
        isSuccess -> SuccessBg
        else      -> Milk
    }
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        placeholder = { Text(placeholder, color = Latte, fontSize = 13.sp) },
        modifier = Modifier.fillMaxWidth().height(50.dp),
        singleLine = true,
        visualTransformation = if (isPassword && !showPassword)
            androidx.compose.ui.text.input.PasswordVisualTransformation()
        else
            androidx.compose.ui.text.input.VisualTransformation.None,
        trailingIcon = if (isPassword && onTogglePassword != null) {
            {
                Text(
                    if (showPassword) "🙈" else "👁",
                    modifier = Modifier.clickable { onTogglePassword() }.padding(end = 8.dp),
                    fontSize = 14.sp
                )
            }
        } else null,
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor   = Coffee,
            unfocusedBorderColor = borderColor,
            focusedContainerColor   = Color.White,
            unfocusedContainerColor = bgColor,
            focusedTextColor   = Dark,
            unfocusedTextColor = Dark
        ),
        shape = RoundedCornerShape(8.dp)
    )
}

// ── Status badge ──────────────────────────────────────────────────────────────
@Composable
fun BrewBadge(status: String) {
    val (bg, fg) = when (status.uppercase()) {
        "IN STOCK", "ACTIVE", "APPROVED", "RECEIVED", "DELIVERED" ->
            SuccessBg to SuccessGreen
        "LOW STOCK", "CANCELLED", "REJECTED" ->
            ErrorBg to ErrorRed
        "PENDING"  -> WarnBg to WarnAmber
        "TRANSIT"  -> Color(0xFFEFF6FF) to Color(0xFF2563EB)
        else       -> Cream to Coffee
    }
    Box(
        modifier = Modifier
            .background(bg, RoundedCornerShape(20.dp))
            .padding(horizontal = 8.dp, vertical = 3.dp)
    ) {
        Text(status, fontSize = 10.sp, color = fg, fontWeight = FontWeight.Bold)
    }
}

// ── Section card ─────────────────────────────────────────────────────────────
@Composable
fun BrewCard(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(4.dp),
        content = content
    )
}

// ── Top app bar ───────────────────────────────────────────────────────────────
@Composable
fun BrewTopBar(
    title: String,
    onRefresh: (() -> Unit)? = null,
    onLogout: (() -> Unit)? = null
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Roast)
            .statusBarsPadding()
            .padding(horizontal = 16.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            "☕ $title",
            color = Color.White,
            fontWeight = FontWeight.Bold,
            fontSize = 17.sp,
            modifier = Modifier.weight(1f)
        )
        if (onRefresh != null) {
            TextButton(
                onClick = onRefresh,
                colors = ButtonDefaults.textButtonColors(contentColor = Color.White)
            ) { Text("↺", fontSize = 16.sp) }
        }
        if (onLogout != null) {
            Spacer(modifier = Modifier.width(4.dp))
            Button(
                onClick = onLogout,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFB91C1C)),
                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp),
                modifier = Modifier.height(34.dp)
            ) { Text("Logout", fontSize = 11.sp, fontWeight = FontWeight.Bold) }
        }
    }
}

// ── Primary action button ─────────────────────────────────────────────────────
@Composable
fun BrewButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    loading: Boolean = false,
    enabled: Boolean = true,
    containerColor: Color = Coffee
) {
    Button(
        onClick = onClick,
        modifier = modifier.fillMaxWidth().height(48.dp),
        shape = RoundedCornerShape(8.dp),
        colors = ButtonDefaults.buttonColors(containerColor = containerColor),
        enabled = enabled && !loading
    ) {
        if (loading) {
            CircularProgressIndicator(
                color = Color.White,
                strokeWidth = 2.dp,
                modifier = Modifier.size(18.dp)
            )
        } else {
            Text(text, fontWeight = FontWeight.Bold, fontSize = 14.sp)
        }
    }
}

// ── Stat card for dashboard ───────────────────────────────────────────────────
@Composable
fun BrewStatCard(
    label: String,
    value: String,
    emoji: String,
    modifier: Modifier = Modifier,
    valueColor: Color = Dark
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(10.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(3.dp)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(emoji, fontSize = 20.sp)
            Spacer(modifier = Modifier.height(6.dp))
            Text(value, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = valueColor)
            Text(label, fontSize = 10.sp, color = Mocha, fontWeight = FontWeight.Medium)
        }
    }
}

// ── Divider ────────────────────────────────────────────────────────────────────
@Composable
fun BrewDivider() {
    HorizontalDivider(color = Cream, thickness = 1.dp)
}

// ── Loading full-screen ────────────────────────────────────────────────────────
@Composable
fun BrewLoader() {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        CircularProgressIndicator(color = Coffee, strokeWidth = 3.dp)
    }
}

// ── Empty state ────────────────────────────────────────────────────────────────
@Composable
fun BrewEmpty(title: String, subtitle: String, emoji: String = "📦") {
    Box(modifier = Modifier.fillMaxWidth().padding(32.dp), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(emoji, fontSize = 40.sp)
            Spacer(modifier = Modifier.height(12.dp))
            Text(title, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Dark)
            Spacer(modifier = Modifier.height(4.dp))
            Text(subtitle, fontSize = 13.sp, color = Mocha)
        }
    }
}

// ── Shared OutlinedTextField colors ───────────────────────────────────────────
@Composable
fun brewFieldColors() = OutlinedTextFieldDefaults.colors(
    focusedBorderColor     = Coffee,
    unfocusedBorderColor   = Cream,
    focusedContainerColor  = Color.White,
    unfocusedContainerColor= Milk,
    focusedTextColor       = Dark,
    unfocusedTextColor     = Dark
)
