<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Display the cart.
     */
    public function index()
    {
        $cart = $this->getUserCart();
        
        return Inertia::render('cart/index', [
            'cart' => $cart,
        ]);
    }

    /**
     * Add item to cart.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        // Check if product is active and in stock
        if (!$product->is_active) {
            return back()->with('error', 'Product is not available.');
        }

        if (!$product->is_in_stock) {
            return back()->with('error', 'Product is out of stock.');
        }

        // Check stock quantity
        if ($product->manage_stock && $product->stock_quantity < $request->quantity) {
            return back()->with('error', 'Insufficient stock available.');
        }

        $cart = $this->getUserCart();
        
        $cart->addItem($request->product_id, $request->quantity, [
            'name' => $product->name,
            'price' => $product->current_price,
            'image' => $product->main_image,
            'sku' => $product->sku,
        ]);

        return back()->with('success', 'Product added to cart successfully.');
    }

    /**
     * Update cart item quantity.
     */
    public function update(Request $request, string $productId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $cart = $this->getUserCart();
        
        if ($request->quantity === 0) {
            $cart->removeItem((int) $productId);
            $message = 'Item removed from cart.';
        } else {
            $cart->updateItemQuantity((int) $productId, $request->quantity);
            $message = 'Cart updated successfully.';
        }

        return back()->with('success', $message);
    }

    /**
     * Remove item from cart.
     */
    public function destroy(string $productId)
    {
        $cart = $this->getUserCart();
        $cart->removeItem((int) $productId);

        return back()->with('success', 'Item removed from cart.');
    }



    /**
     * Get or create user cart.
     *
     * @return Cart
     */
    protected function getUserCart(): Cart
    {
        if (Auth::check()) {
            // For authenticated users
            return Cart::firstOrCreate([
                'user_id' => Auth::id(),
            ], [
                'items' => [],
                'subtotal' => 0,
                'tax_amount' => 0,
                'total' => 0,
            ]);
        } else {
            // For guest users
            $sessionId = session()->getId();
            return Cart::firstOrCreate([
                'session_id' => $sessionId,
            ], [
                'items' => [],
                'subtotal' => 0,
                'tax_amount' => 0,
                'total' => 0,
            ]);
        }
    }
}