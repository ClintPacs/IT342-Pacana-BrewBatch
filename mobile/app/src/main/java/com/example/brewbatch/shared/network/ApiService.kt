package com.example.brewbatch.shared.network

import retrofit2.Response
import retrofit2.http.*

data class RegisterRequest(
    val username: String,
    val fullName: String,
    val email: String,
    val password: String,
    val role: String = "BARISTA"
)

data class LoginRequest(
    val username: String,
    val password: String
)

// ── Nested response matching actual backend structure ──
data class LoginResponse(
    val success: Boolean?,
    val data: LoginData?,
    val error: Any?,
    val timestamp: String?
)

data class LoginData(
    val token: String?,
    val type: String?,
    val user: UserInfo?
)

data class UserInfo(
    val id: Long?,
    val username: String?,
    val email: String?,
    val fullName: String?,
    val role: String?
)

data class MessageResponse(
    val success: Boolean,
    val message: String?
)

data class UserProfile(
    val id: Long?,
    val username: String?,
    val email: String?,
    val fullName: String?,
    val role: String?
)

interface ApiService {
    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<MessageResponse>

    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @GET("api/user/me")
    suspend fun getMe(@Header("Authorization") token: String): Response<Any>
}