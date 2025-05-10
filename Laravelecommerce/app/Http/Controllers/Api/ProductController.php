<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }

    public function search($query)
    {
        $products = Product::where('title', 'like', "%$query%")
            ->orWhere('category', 'like', "%$query%")
            ->get();
            
        return response()->json($products);
    }
}