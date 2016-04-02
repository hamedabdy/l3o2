package com.example.ndiaab.concert;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.squareup.picasso.Picasso;


public class Details extends Activity {

    Concert concert;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_details);


        Intent intent = getIntent();
        if (intent.getExtras() != null) {
            concert = intent.getExtras().getParcelable("concert");

            ImageView imageView = (ImageView) findViewById(R.id.imageView);
            concert.setUrlGrandeImage();
            if(!concert.getUrlGrandeImage().isEmpty()) {
                Picasso.with(this)
                        .load(concert.urlGrandeImage)
                        .into(imageView);
            }
            else {
                if(!concert.urlImage.isEmpty()){
                Picasso.with(this)
                        .load(concert.urlImage)
                        .into(imageView);
                }
            }

            TextView titre = (TextView) findViewById(R.id.titre);
            titre.setText(concert.title);

            TextView nom = (TextView) findViewById(R.id.nom);
            nom.setText(concert.nom);

            TextView artiste = (TextView) findViewById(R.id.artiste);
            artiste.setText(concert.artistes);

            TextView date = (TextView) findViewById(R.id.date);
            date.setText("Date : "+concert.dateFormat);

            TextView url = (TextView) findViewById(R.id.horaire);
            url.setText("Horaire : "+concert.heureFormat);
        }

    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        //getMenuInflater().inflate(R.menu.menu_details, menu);
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

    public void syRendre(View v)
    {
        // Creates an Intent that will load a map of San Francisco
        Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse("geo:0,0?q="+concert.longitude+","+concert.lattitude+"("+concert.nom+")"));
        startActivity(i);
    }
}
