<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('authenticated users are redirected to attendance dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get('/dashboard')->assertRedirect(route('attendance.index'));
});
