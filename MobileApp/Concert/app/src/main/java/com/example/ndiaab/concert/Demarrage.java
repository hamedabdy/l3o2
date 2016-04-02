package com.example.ndiaab.concert;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

import java.util.Timer;
import java.util.TimerTask;
import java.util.logging.Handler;


public class Demarrage extends Activity {
    String alarm = Context.ALARM_SERVICE;
    private static final int STOPSPLASH = 0;
    private static final long SPLASHTIME = 5000;

    private Handler splashHandler;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_demarrage);

        new Timer().schedule(new TimerTask() {
            public void run() {
                Intent main = new Intent(Demarrage.this, Main.class);
                //main.addFlags(Intent.f);
                startActivity(main);
                finish();
            }
        }, 2000);
/*
        Intent main = new Intent(this, Main.class);
        main.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
        PendingIntent pA = PendingIntent.getActivity(this.getApplicationContext(), 0, main, 0);
        AlarmManager a = (AlarmManager) this.getApplicationContext().getSystemService(alarm);
        a.setExact(AlarmManager.RTC_WAKEUP, System.currentTimeMillis() + 1500, pA);*/
    }



    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}
