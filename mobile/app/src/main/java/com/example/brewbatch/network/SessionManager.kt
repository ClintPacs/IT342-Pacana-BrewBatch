package com.example.brewbatch.network

import android.content.Context
import android.content.SharedPreferences

class SessionManager(context: Context) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("brewbatch_prefs", Context.MODE_PRIVATE)

    fun saveToken(token: String) = prefs.edit().putString("jwt_token", token).apply()
    fun getToken(): String? = prefs.getString("jwt_token", null)
    fun clearToken() = prefs.edit().remove("jwt_token").apply()

    fun saveUsername(username: String) = prefs.edit().putString("username", username).apply()
    fun getUsername(): String? = prefs.getString("username", null)

    fun isLoggedIn(): Boolean = getToken() != null
}