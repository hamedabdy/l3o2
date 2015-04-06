package com.example.ndiaab.concert;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.widget.ImageView;
import android.widget.TextView;

import com.squareup.picasso.Picasso;


public class Information extends ActionBarActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_information);
        Intent intent = getIntent();
        Concert concert = (Concert) intent.getExtras().getParcelable("concert");
        TextView myAwesomeTextView = (TextView)findViewById(R.id.Test);
        Log.e("Response: ", "> " + concert);
        //in your OnCreate() method
        myAwesomeTextView.setText(concert.getArtistes());
        ImageView imageView = (ImageView) findViewById(R.id.imageView);
        Picasso.with(this)
                .load(concert.getUrlImage())
                .into(imageView);
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.menu_information, menu);
        //getMenuInflater().inflate(R.menu.test, menu);


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
