<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;

Route::middleware('api')->group(function () {
    // Products
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::get('/products/search/{query}', [ProductController::class, 'search']);
    
    // Cart
    Route::post('/cart/add/{product_id}', [CartController::class, 'addToCart']);
    Route::get('/cart/{user_id}', [CartController::class, 'getCart']);
    Route::delete('/cart/remove/{cart_id}', [CartController::class, 'removeFromCart']);
    Route::delete('/cart/clear/{user_id}', [CartController::class, 'clearCart']);
    
    // Orders
    Route::post('/orders/create', [OrderController::class, 'create']);
    Route::get('/orders/{user_id}', [OrderController::class, 'getOrders']);
    Route::post('/orders/cancel/{order_id}', [OrderController::class, 'cancelOrder']);
});