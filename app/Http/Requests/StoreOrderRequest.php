<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'payment_method' => 'required|in:qris,bank_transfer,bitcoin,ethereum',
            'billing_address' => 'required|array',
            'billing_address.first_name' => 'required|string|max:255',
            'billing_address.last_name' => 'required|string|max:255',
            'billing_address.email' => 'required|email|max:255',
            'billing_address.phone' => 'required|string|max:20',
            'billing_address.address_line_1' => 'required|string|max:255',
            'billing_address.address_line_2' => 'nullable|string|max:255',
            'billing_address.city' => 'required|string|max:255',
            'billing_address.state' => 'required|string|max:255',
            'billing_address.postal_code' => 'required|string|max:20',
            'billing_address.country' => 'required|string|max:255',
            'shipping_address' => 'required|array',
            'shipping_address.first_name' => 'required|string|max:255',
            'shipping_address.last_name' => 'required|string|max:255',
            'shipping_address.address_line_1' => 'required|string|max:255',
            'shipping_address.address_line_2' => 'nullable|string|max:255',
            'shipping_address.city' => 'required|string|max:255',
            'shipping_address.state' => 'required|string|max:255',
            'shipping_address.postal_code' => 'required|string|max:20',
            'shipping_address.country' => 'required|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'payment_method.required' => 'Please select a payment method.',
            'payment_method.in' => 'Invalid payment method selected.',
            'billing_address.first_name.required' => 'Billing first name is required.',
            'billing_address.last_name.required' => 'Billing last name is required.',
            'billing_address.email.required' => 'Email address is required.',
            'billing_address.email.email' => 'Please provide a valid email address.',
            'billing_address.phone.required' => 'Phone number is required.',
            'billing_address.address_line_1.required' => 'Billing address is required.',
            'billing_address.city.required' => 'City is required.',
            'billing_address.state.required' => 'State/Province is required.',
            'billing_address.postal_code.required' => 'Postal code is required.',
            'billing_address.country.required' => 'Country is required.',
            'shipping_address.first_name.required' => 'Shipping first name is required.',
            'shipping_address.last_name.required' => 'Shipping last name is required.',
            'shipping_address.address_line_1.required' => 'Shipping address is required.',
            'shipping_address.city.required' => 'Shipping city is required.',
            'shipping_address.state.required' => 'Shipping state/province is required.',
            'shipping_address.postal_code.required' => 'Shipping postal code is required.',
            'shipping_address.country.required' => 'Shipping country is required.',
        ];
    }
}