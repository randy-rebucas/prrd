<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $fillable = ['filename', 'path', 'original_name', 'mime_type', 'size'];
}
