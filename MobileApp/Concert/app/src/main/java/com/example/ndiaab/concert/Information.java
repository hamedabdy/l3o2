package com.example.ndiaab.concert;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;

import java.util.ArrayList;
import java.util.List;


public class Information extends Activity implements AdapterView.OnItemClickListener {
    private List<Concert> movieList = new ArrayList<>();
    private ListView listView;
    private CustomListAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_information);
        Intent intent = getIntent();
        //Concert concert = (Concert) intent.getExtras().getParcelable("concert");

        listView = (ListView) findViewById(R.id.list);
        movieList = intent.getExtras().getParcelableArrayList("liste");
        adapter = new CustomListAdapter(this, movieList);
        Log.d("TEST", movieList.toString());
        adapter.notifyDataSetChanged();
        listView.setAdapter(adapter);
        listView.setOnItemClickListener(this);
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        //getMenuInflater().inflate(R.menu.menu_information, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        Intent intent = new Intent(getBaseContext() , Details.class);
        System.out.println("Quel variable cliqué :"+position);
        Concert unConcert = movieList.get(position);
        intent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
        intent.putExtra("concert", unConcert);
        startActivity(intent);
    }
}
