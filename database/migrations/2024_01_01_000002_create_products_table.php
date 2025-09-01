<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('short_description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->string('sku')->unique();
            $table->integer('stock_quantity')->default(0);
            $table->boolean('manage_stock')->default(true);
            $table->enum('stock_status', ['in_stock', 'out_of_stock', 'on_backorder'])->default('in_stock');
            $table->decimal('weight', 8, 2)->nullable()->comment('Weight in kg');
            $table->json('dimensions')->nullable()->comment('Length, width, height');
            $table->json('images')->nullable()->comment('Product images array');
            $table->json('gallery')->nullable()->comment('Additional gallery images');
            $table->boolean('featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->json('meta_data')->nullable()->comment('SEO and additional metadata');
            $table->timestamps();
            
            $table->index('slug');
            $table->index('sku');
            $table->index(['is_active', 'featured']);
            $table->index(['is_active', 'stock_status']);
            $table->index('price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};