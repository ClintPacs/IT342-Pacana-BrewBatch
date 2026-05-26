package com.example.brewbatch.shared.network

import retrofit2.Response
import retrofit2.http.*

// ── Auth ──────────────────────────────────────────────────────────────────────
data class RegisterRequest(
    val username: String,
    val fullName: String,
    val email: String,
    val password: String,
    val role: String = "BARISTA"
)

data class LoginRequest(val username: String, val password: String)

data class LoginResponse(
    val success: Boolean?,
    val data: LoginData?,
    val error: Any?,
    val timestamp: String?
)

data class LoginData(val token: String?, val type: String?, val user: UserInfo?)

data class UserInfo(
    val id: Long?,
    val username: String?,
    val email: String?,
    val fullName: String?,
    val role: String?
)

data class MessageResponse(val success: Boolean, val message: String?)

data class UserProfile(
    val id: Long?,
    val username: String?,
    val email: String?,
    val fullName: String?,
    val role: String?
)

// ── Inventory ─────────────────────────────────────────────────────────────────
data class InventoryItem(
    val id: Long = 0,
    val name: String = "",
    val category: String = "",
    val unit: String = "",
    val currentStock: Double = 0.0,
    val reorderThreshold: Double = 0.0,
    val isLowStock: Boolean = false,
    val archived: Boolean = false
)

data class InventoryRequest(
    val name: String,
    val category: String,
    val unit: String,
    val currentStock: Double,
    val reorderThreshold: Double
)

data class ApiListResponse<T>(
    val success: Boolean?,
    val data: List<T>?,
    val error: Any?
)

data class ApiSingleResponse<T>(
    val success: Boolean?,
    val data: T?,
    val error: Any?
)

// ── Orders ────────────────────────────────────────────────────────────────────
data class Order(
    val id: Long = 0,
    val supplier: String = "",
    val supplierEmail: String = "",
    val item: String = "",
    val quantity: Int = 0,
    val totalCost: Double = 0.0,
    val status: String = "PENDING",
    val createdAt: String? = null
)

data class OrderRequest(
    val supplier: String,
    val supplierEmail: String,
    val item: String,
    val quantity: Int,
    val totalCost: Double
)

// ── Suppliers ─────────────────────────────────────────────────────────────────
data class Supplier(
    val id: Long = 0,
    val name: String = "",
    val email: String = "",
    val phone: String = "",
    val address: String = "",
    val contactPerson: String = "",
    val active: Boolean = true
)

data class SupplierRequest(
    val name: String,
    val email: String,
    val phone: String,
    val address: String,
    val contactPerson: String
)

// ── API interface ─────────────────────────────────────────────────────────────
interface ApiService {

    // Auth
    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<MessageResponse>

    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @GET("api/user/me")
    suspend fun getMe(@Header("Authorization") token: String): Response<Any>

    // Inventory
    @GET("api/inventory")
    suspend fun getInventory(
        @Header("Authorization") token: String,
        @Query("search") search: String? = null,
        @Query("category") category: String? = null
    ): Response<ApiListResponse<InventoryItem>>

    @GET("api/inventory/alerts")
    suspend fun getInventoryAlerts(
        @Header("Authorization") token: String
    ): Response<ApiListResponse<InventoryItem>>

    @POST("api/inventory")
    suspend fun createInventoryItem(
        @Header("Authorization") token: String,
        @Body request: InventoryRequest
    ): Response<ApiSingleResponse<InventoryItem>>

    @PUT("api/inventory/{id}")
    suspend fun updateInventoryItem(
        @Header("Authorization") token: String,
        @Path("id") id: Long,
        @Body request: InventoryRequest
    ): Response<ApiSingleResponse<InventoryItem>>

    @DELETE("api/inventory/{id}")
    suspend fun archiveInventoryItem(
        @Header("Authorization") token: String,
        @Path("id") id: Long
    ): Response<MessageResponse>

    // Orders
    @GET("api/orders")
    suspend fun getOrders(
        @Header("Authorization") token: String
    ): Response<ApiListResponse<Order>>

    @POST("api/orders")
    suspend fun createOrder(
        @Header("Authorization") token: String,
        @Body request: OrderRequest
    ): Response<ApiSingleResponse<Order>>

    @PUT("api/orders/{id}/cancel")
    suspend fun cancelOrder(
        @Header("Authorization") token: String,
        @Path("id") id: Long
    ): Response<ApiSingleResponse<Order>>

    @DELETE("api/orders/{id}")
    suspend fun deleteOrder(
        @Header("Authorization") token: String,
        @Path("id") id: Long
    ): Response<MessageResponse>

    // Suppliers
    @GET("api/suppliers")
    suspend fun getSuppliers(
        @Header("Authorization") token: String
    ): Response<ApiListResponse<Supplier>>

    @POST("api/suppliers")
    suspend fun createSupplier(
        @Header("Authorization") token: String,
        @Body request: SupplierRequest
    ): Response<ApiSingleResponse<Supplier>>

    @PUT("api/suppliers/{id}")
    suspend fun updateSupplier(
        @Header("Authorization") token: String,
        @Path("id") id: Long,
        @Body request: SupplierRequest
    ): Response<ApiSingleResponse<Supplier>>
}