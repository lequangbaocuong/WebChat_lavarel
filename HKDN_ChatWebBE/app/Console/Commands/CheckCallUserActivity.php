<?php

namespace App\Console\Commands;

use App\Models\CallUsers;
use Illuminate\Console\Command;
use Carbon\Carbon;

class CheckCallUserActivity extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'activity:check-call-user-activity';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for inactive users in call room';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $threshold = Carbon::now()->subMinutes(1.5);
        CallUsers::where('last_heartbeat_at', '<', $threshold)
        ->update([
            "last_heartbeat_at" => null
        ]);

        return 0;
    }
}
