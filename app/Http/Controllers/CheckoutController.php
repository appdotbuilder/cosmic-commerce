<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class CheckoutController extends Controller
{
    /**
     * Display the checkout page.
     */
    public function index()
    {
        $cart = $this->getUserCart();

        if (!$cart || empty($cart->items)) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        return Inertia::render('checkout/index', [
            'cart' => $cart,
            'cryptoRates' => $this->getCryptocurrencyRates(),
        ]);
    }

    /**
     * Process the checkout.
     */
    public function store(StoreOrderRequest $request)
    {

        $cart = $this->getUserCart();

        if (!$cart || empty($cart->items)) {
            return back()->with('error', 'Your cart is empty.');
        }

        // Calculate shipping (simplified)
        $shippingAmount = 15.00; // Fixed shipping cost

        // Create order
        $orderData = [
            'order_number' => Order::generateOrderNumber(),
            'user_id' => Auth::id(),
            'status' => 'pending',
            'payment_status' => 'pending',
            'payment_method' => $request->validated()['payment_method'],
            'subtotal' => $cart->subtotal,
            'tax_amount' => $cart->tax_amount,
            'shipping_amount' => $shippingAmount,
            'total' => $cart->subtotal + $cart->tax_amount + $shippingAmount,
            'currency' => 'IDR',
            'billing_address' => $request->validated()['billing_address'],
            'shipping_address' => $request->validated()['shipping_address'],
            'items' => $cart->items,
            'notes' => $request->validated()['notes'] ?? null,
        ];

        // Handle cryptocurrency payments
        if (in_array($request->validated()['payment_method'], ['bitcoin', 'ethereum'])) {
            $cryptoRates = $this->getCryptocurrencyRates();
            $cryptoCurrency = strtoupper($request->validated()['payment_method']);
            
            if (isset($cryptoRates[$cryptoCurrency])) {
                $rate = $cryptoRates[$cryptoCurrency];
                $cryptoAmount = $orderData['total'] / $rate;
                
                $orderData['crypto_amount'] = $cryptoAmount;
                $orderData['crypto_currency'] = $cryptoCurrency;
                $orderData['crypto_rate'] = $rate;
            }
        }

        $order = Order::create($orderData);

        // Clear cart after successful order
        $cart->clear();

        return redirect()->route('checkout.success', $order->order_number)
            ->with('success', 'Order placed successfully!');
    }

    /**
     * Display order success page.
     */
    public function show(string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();
        
        // Only allow access to order owner or guest who just placed it
        if ($order->user_id && $order->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('checkout/success', [
            'order' => $order,
        ]);
    }

    /**
     * Get or create user cart.
     *
     * @return Cart|null
     */
    protected function getUserCart(): ?Cart
    {
        if (Auth::check()) {
            return Cart::where('user_id', Auth::id())->first();
        } else {
            return Cart::where('session_id', session()->getId())->first();
        }
    }

    /**
     * Get cryptocurrency rates (mock implementation).
     *
     * @return array
     */
    protected function getCryptocurrencyRates(): array
    {
        // In a real application, you would fetch from a crypto API like CoinGecko
        // For demo purposes, using mock rates
        return [
            'BTC' => 650000000, // 650M IDR per BTC
            'ETH' => 45000000,  // 45M IDR per ETH
        ];
    }
}