package com.example.ndiaab.concert;


import android.app.ProgressDialog;
import android.content.Intent;
import android.location.Location;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Vibrator;
import android.support.v4.app.FragmentActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.widget.ImageView;
import android.widget.SeekBar;
import android.widget.Toast;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.maps.android.clustering.Cluster;
import com.google.maps.android.clustering.ClusterManager;
import com.google.maps.android.clustering.view.DefaultClusterRenderer;
import com.google.maps.android.ui.IconGenerator;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Random;

public class Main extends FragmentActivity implements OnMapReadyCallback, GoogleMap.OnInfoWindowClickListener, GoogleMap.OnMarkerClickListener, GoogleMap.OnMyLocationButtonClickListener, GoogleMap.OnCameraChangeListener,
        ClusterManager.OnClusterClickListener<Concert>, ClusterManager.OnClusterInfoWindowClickListener<Concert>, ClusterManager.OnClusterItemClickListener<Concert>, ClusterManager.OnClusterItemInfoWindowClickListener<Concert>
{

    private GoogleMap mMap; // Might be null if Google Play services APK is not available.
    private ProgressDialog pDialog;

    //private ProgressDialog pDialog;

    // URL to get contacts JSON
    private double majLattitude=0;
    private double majLongitude=0;
    private int majDistance=20;
    private String majArtiste="";

    private Random mRandom = new Random(1984);

    float mCurrentZoom;
    ArrayList<Marker> mMarkers;
    ArrayList<Marker> mClusterMarkers;

    private ClusterManager<Concert> mClusterManager;


    //private ClusterManager<MyItem> mClusterManager;

    // JSON Node names
    private static final String TAG_ID = "_id";
    private static final String TAG_TITLE = "title";
    private static final String TAG_ARTIST = "artist";
    private static final String TAG_ADDRESS = "address";
    private static final String TAG_NAME = "name";
    private static final String TAG_STREET = "street";
    private static final String TAG_POSTALCODE = "postalcode";
    private static final String TAG_CITY = "city";
    private static final String TAG_COUNTRY = "country";
    private static final String TAG_LATLONG_TAB = "latlong";
    private static final String TAG_URL = "url";
    private static final String TAG_DATE = "startDate";
    private static final String TAG_IMAGE = "image";
    private ArrayList<MarkerOptions> mesMarkers;

    private ArrayList<Concert> mesConcerts;
    private HashMap<String,Concert> infoConcert;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mMarkers = new ArrayList<Marker>();
        mClusterMarkers = new ArrayList<Marker>();

        setContentView(R.layout.activity_main);
        infoConcert = new HashMap<>();
        mesConcerts = new ArrayList<>();
        mesMarkers = new ArrayList<>();
        setUpMapIfNeeded();
        mMap.setOnMarkerClickListener(this);
        mMap.setOnInfoWindowClickListener(this);
        mMap.setOnMyLocationButtonClickListener(this);
        SeekBar seekBar = (SeekBar) findViewById(R.id.seekBar);

        seekBar.setOnSeekBarChangeListener(
                new SeekBar.OnSeekBarChangeListener() {
            int progress = 0;


                    @Override
            public void onProgressChanged(SeekBar seekBar, int progresValue, boolean fromUser) {
                progress = progresValue;
                //Toast.makeText(getApplicationContext(), progresValue, Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {
                //Toast.makeText(getApplicationContext(), "Started tracking seekbar", Toast.LENGTH_SHORT).show();
                //Toast.makeText(getApplicationContext(), progress, Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {
                //textView.setText("Covered: " + progress + "/" + seekBar.getMax());
                Vibrator v = (Vibrator) getApplicationContext().getSystemService(getApplicationContext().VIBRATOR_SERVICE);
                if(progress<=5){
                    Toast.makeText(Main.this,"Distance : 5 KM", Toast.LENGTH_SHORT).show();
                    seekBar.setProgress(5);
                    setMajDistance(seekBar.getProgress());
                    v.vibrate(200);
                }
                else
                if(progress<=10){
                    Toast.makeText(Main.this,"Distance : 10 KM", Toast.LENGTH_SHORT).show();
                    seekBar.setProgress(10);
                    setMajDistance(seekBar.getProgress());
                    v.vibrate(200);
                }
                else
                if (progress>10 & progress<=20){
                    Toast.makeText(Main.this,"Distance : 20 KM", Toast.LENGTH_SHORT).show();
                    seekBar.setProgress(20);
                    setMajDistance(seekBar.getProgress());
                }
                else
                if(progress>20 &progress<=30){
                    Toast.makeText(Main.this,"Distance : 30 KM", Toast.LENGTH_SHORT).show();
                    seekBar.setProgress(30);
                    setMajDistance(seekBar.getProgress());
                }
                else
                if (progress >30 &progress<=40){
                    Toast.makeText(Main.this,"Distance : 40 KM", Toast.LENGTH_SHORT).show();
                    seekBar.setProgress(40);
                    setMajDistance(seekBar.getProgress());
                }
                else
                if(progress>40 &progress<=50){
                    Toast.makeText(Main.this,"Distance : 50 KM", Toast.LENGTH_SHORT).show();
                    seekBar.setProgress(50);
                    setMajDistance(seekBar.getProgress());
                }
                else
                if (progress >50 &progress<=60){
                    Toast.makeText(Main.this,"Distance : 100 KM", Toast.LENGTH_SHORT).show();
                    seekBar.setProgress(60);
                    setMajDistance(100);
                }
                else
                if (progress >60 &progress<=70){
                    Toast.makeText(Main.this,"Distance : 200 KM", Toast.LENGTH_SHORT).show();
                    seekBar.setProgress(70);
                    setMajDistance(200);
                }
                else
                if (progress >70 &progress<=80){
                    Toast.makeText(Main.this,"Distance : 300 KM", Toast.LENGTH_SHORT).show();
                    seekBar.setProgress(80);
                    setMajDistance(300);
                }
                else
                if (progress >80 &progress<=90){
                    Toast.makeText(Main.this,"Distance : 400 KM", Toast.LENGTH_SHORT).show();
                    seekBar.setProgress(90);
                    setMajDistance(400);
                }
                else
                if (progress >90 &progress<=100){
                    Toast.makeText(Main.this,"Distance : 500 KM", Toast.LENGTH_SHORT).show();
                    seekBar.setProgress(100);
                    setMajDistance(500);
                    v.vibrate(200);
                }
            }
    });
        //mClusterManager = new ClusterManager<MyItem>(this, getMap());
        //mClusterManager = new ClusterManager<Person>(this, getMap());
        //getMap().setOnCameraChangeListener(mClusterManager);
        mClusterManager = new ClusterManager<Concert>(this, getMap());
        mClusterManager.setRenderer(new PersonRenderer());
        getMap().setOnCameraChangeListener(mClusterManager);
        getMap().setOnMarkerClickListener(mClusterManager);
        getMap().setOnInfoWindowClickListener(mClusterManager);
        mClusterManager.setOnClusterClickListener(this);
        mClusterManager.setOnClusterInfoWindowClickListener(this);
        mClusterManager.setOnClusterItemClickListener(this);
        mClusterManager.setOnClusterItemInfoWindowClickListener(this);
        mClusterManager.cluster();

    }

    @Override
    protected void onResume() {
        super.onResume();
        setUpMapIfNeeded();
    }

    /**
     * Sets up the map if it is possible to do so (i.e., the Google Play services APK is correctly
     * installed) and the map has not already been instantiated.. This will ensure that we only ever
     * call {@link #setUpMap()} once when {@link #mMap} is not null.
     * <p/>
     * If it isn't installed {@link SupportMapFragment} (and
     * {@link com.google.android.gms.maps.MapView MapView}) will show a prompt for the user to
     * install/update the Google Play services APK on their device.
     * <p/>
     * A user can return to this FragmentActivity after following the prompt and correctly
     * installing/updating/enabling the Google Play services. Since the FragmentActivity may not
     * have been completely destroyed during this process (it is likely that it would only be
     * stopped or paused), {@link #onCreate(Bundle)} may not be called again so we should call this
     * method in {@link #onResume()} to guarantee that it will be called.
    */
    private void setUpMapIfNeeded() {
        // Do a null check to confirm that we have not already instantiated the map.
        if (mMap == null) {
            // Try to obtain the map from the SupportMapFragment.
            mMap = ((SupportMapFragment) getSupportFragmentManager().findFragmentById(R.id.map))
                    .getMap();
            // Check if we were successful in obtaining the map.
            if (mMap != null) {
                setUpMap();
            }
        }
    }

    /**
     * This is where we can add markers or lines, add listeners or move the camera. In this case, we
     * just add a marker near Africa.
     * <p/>
     * This should only be called once and when we are sure that {@link #mMap} is not null.
    */
    private void setUpMap() {
        LatLng paris = new LatLng(48.856614,2.3522219);
        mMap.setMyLocationEnabled(true);
        mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(paris,7));
    }

    @Override
    public boolean onMyLocationButtonClick() {
        Location maLocation=mMap.getMyLocation();
        if (maLocation != null) {
            Double lat = maLocation.getLatitude();
            Double longitude = maLocation.getLongitude();
            setMajLattitude(lat);
            setMajLongitude(longitude);
            new GetConcerts().execute();
        }
        else
            Toast.makeText(Main.this,"Localisation en cours", Toast.LENGTH_SHORT).show();
        return false;
    }
    public boolean onMyIconeButtonClick(IconGenerator uneIcone) {
            Toast.makeText(Main.this,"Localisation en cours", Toast.LENGTH_SHORT).show();
        return false;
    }

    @Override
    public void onCameraChange(CameraPosition cameraPosition) {

    }

    public class GetConcerts extends AsyncTask<Void, Void, Void> {

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            mMap.clear();
            // Showing progress dialog
            pDialog = new ProgressDialog(Main.this);
            pDialog.setMessage("Please wait...");
            pDialog.setCancelable(false);
            pDialog.show();
        }

        @Override
        protected Void doInBackground(Void... arg0) {
            mesConcerts.clear();
            String url = "http://concert-dacote.herokuapp.com/concert?lat="+majLattitude+"&long="+majLongitude+"&range="+majDistance+"&artist="+majArtiste;
            // Creating service handler class instance
            ServiceHandler sh = new ServiceHandler();

            // Making a request to url and getting response
            String jsonStr = sh.makeServiceCall(url, ServiceHandler.GET);

            //Log.d("Response: ", "> " + jsonStr);

            if (jsonStr != null) {
                try {
                    JSONArray jsonObj = new JSONArray(jsonStr);

                    // looping through All Concerts
                    for (int i = 0; i < jsonObj.length() ; i++) {
                        JSONObject unConcert = jsonObj.getJSONObject(i);

                        String id = unConcert.getString(TAG_ID);
                        String title = unConcert.getString(TAG_TITLE);
                        String artists =unConcert.getString(TAG_ARTIST);

                        JSONObject address = unConcert.getJSONObject(TAG_ADDRESS);
                        String nom =address.getString(TAG_NAME);
                        String rue = address.getString(TAG_STREET);
                        String codePostal = address.getString(TAG_POSTALCODE);
                        String ville = address.getString(TAG_CITY);
                        String pays = address.getString(TAG_COUNTRY);

                        JSONArray coordonnees = unConcert.getJSONArray(TAG_LATLONG_TAB);
                        Double longitude = coordonnees.getDouble(0);
                        Double lattitude = coordonnees.getDouble(1);


                        String monUrl = unConcert.getString(TAG_URL);
                        String date = unConcert.getString(TAG_DATE);
                        String image =unConcert.getString(TAG_IMAGE);
                        ArrayList<String> artistes = new ArrayList<String>();
                        artistes.add(artists);
                        Concert monConcert = new Concert(id,title,artists,nom,rue,codePostal,ville,pays,lattitude,longitude,monUrl,date,image);


                        HashMap<String, String> concert = new HashMap<String, String>();
                        concert.put(TAG_ID,id);
                        concert.put(TAG_TITLE,title);
                        concert.put("longitude",String.valueOf(longitude));
                        concert.put("lattitude",String.valueOf(lattitude));
                        mesConcerts.add(monConcert);

                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            } else {
                Log.e("ServiceHandler", "Couldn't get any data from the url");
            }
            return null;
        }

        @Override
        protected void onPostExecute(Void result) {
            super.onPostExecute(result);
            // Dismiss the progress dialog
            if (pDialog.isShowing()) {
                pDialog.dismiss();

            if (mesConcerts.isEmpty() !=true) {
                for(int i=0; i<mesConcerts.size();i++){
                LatLng sydney = new LatLng(mesConcerts.get(i).getLongitude(),mesConcerts.get(i).getLattitude());
                    /*Marker unMarker = mMap.addMarker(new MarkerOptions()
                            .title(mesConcerts.get(i).getTitle())
                            .snippet(mesConcerts.get(i).getId() + " " + mesConcerts.get(i).getTitle())
                            .position(sydney).icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_VIOLET))

                            );
                    mesConcerts.get(i).setIdMarker(unMarker.getId());
                    infoConcert.put(unMarker.getId(), mesConcerts.get(i));
                    mMarkers.add(unMarker);*/
                    MyItem items = new MyItem(mesConcerts.get(i).getLongitude(),mesConcerts.get(i).getLattitude());
                    //mClusterManager.addItem(items);
                    mClusterManager.addItem(mesConcerts.get(i));
                    getMap().setOnCameraChangeListener(mClusterManager);
                    }
                }
                Toast.makeText(Main.this, mesConcerts.size() + " concerts autour de vous !!", Toast.LENGTH_SHORT).show();
            }
        }
    }

    @Override
    public void onMapReady(GoogleMap map) {
        map.moveCamera(CameraUpdateFactory.newLatLngZoom(
                new LatLng(48.9545422, 2.1615986), 20));
        // You can customize the marker image using images bundled with
        // your app, or dynamically generated bitmaps.
        map.addMarker(new MarkerOptions()
                .anchor(0.0f, 1.0f) // Anchors the marker on the bottom left
                .position(new LatLng(41.889, -87.622)));
    }


    @Override
    public boolean onMarkerClick(Marker marker) {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public void onInfoWindowClick(Marker marker) {
        // When touch InfoWindow on the marker, display another screen.
        Intent intent = new Intent(this, Information.class);
        Log.e("Response: ", "> " + infoConcert.get(marker.getId()).getTitle());
        Concert unConcert = infoConcert.get(marker.getId());
        intent.putExtra("concert",unConcert);
        intent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
        startActivity(intent);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.menu_information, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.menu_search:
                // Comportement du bouton "Recherche"
                boolean b = onSearchRequested();
        }
        return true;
    }

    public void setMajLattitude(double majLattitude) {
        this.majLattitude = majLattitude;
    }

    public void setMajLongitude(double majLongitude) {
        this.majLongitude = majLongitude;
    }

    public void setMajDistance(int majDistance) {
        this.majDistance = majDistance;
    }

    public void setMajArtiste(String majArtiste) {
        this.majArtiste = majArtiste;
    }

    protected GoogleMap getMap() {
        setUpMapIfNeeded();
        return mMap;
    }

    private double random(double min, double max) {
        return mRandom.nextDouble() * (max - min) + min;
    }

    @Override
    public boolean onClusterClick(Cluster<Concert> cluster) {
        // Show a toast with some info when the cluster is clicked.
        String firstName = cluster.getItems().iterator().next().getTitle();
        Toast.makeText(this, cluster.getSize()+" Concerts", Toast.LENGTH_SHORT).show();
        /*AlertDialog.Builder builder = new AlertDialog.Builder(Main.this);
        builder.setMessage("Titre boite");
        builder.setTitle ("Détails boite");
        AlertDialog ad = builder.create();
        ad.show();*/
        /*IconGenerator iconFactory = new IconGenerator(this);
        iconFactory.setContentRotation(180);
        iconFactory.setRotation(180);
        iconFactory.setStyle(IconGenerator.STYLE_PURPLE);
        addIcon(iconFactory, "Default", new LatLng(cluster.getPosition().latitude,cluster.getPosition().longitude));
        onMyIconeButtonClick(iconFactory);*/
        return true;
    }

    @Override
    public void onClusterInfoWindowClick(Cluster<Concert> cluster) {
        // Does nothing, but you could go to a list of the users.

    }

    @Override
    public boolean onClusterItemClick(Concert item) {
        // Does nothing, but you could go into the user's profile page, for example.
        return false;
    }

    @Override
    public void onClusterItemInfoWindowClick(Concert item) {
        // Does nothing, but you could go into the user's profile page, for example.
        Intent intent = new Intent(this, Information.class);
        intent.putExtra("concert",item);
        intent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
        startActivity(intent);
    }


    private class PersonRenderer extends DefaultClusterRenderer<Concert> {
        private final IconGenerator mIconGenerator = new IconGenerator(getApplicationContext());
        private  IconGenerator mClusterIconGenerator = new IconGenerator(getApplicationContext());
        private  ImageView mImageView;
        private  ImageView mClusterImageView;
        private  int mDimension;

        public PersonRenderer() {
            super(getApplicationContext(), getMap(), mClusterManager);
           /* View multiProfile = getLayoutInflater().inflate(R.layout.multi_profile, null);
            mClusterIconGenerator.setContentView(multiProfile);
            mClusterImageView = (ImageView) multiProfile.findViewById(R.id.image);

            mImageView = new ImageView(getApplicationContext());
            mDimension = (int) getResources().getDimension(R.dimen.custom_profile_image);
            mImageView.setLayoutParams(new ViewGroup.LayoutParams(mDimension, mDimension));
            int padding = (int) getResources().getDimension(R.dimen.custom_profile_padding);
            mImageView.setPadding(padding, padding, padding, padding);
            mIconGenerator.setContentView(mImageView);*/
        }

        @Override
        protected void onBeforeClusterItemRendered(Concert unConcert, MarkerOptions markerOptions) {
            // Draw a single person.
            // Set the info window to show their name.
            //mImageView.setImageResource(person.profilePhoto);
            //Bitmap icon = mIconGenerator.makeIcon();
            markerOptions.title(unConcert.getTitle());
        }
        @Override
        protected boolean shouldRenderAsCluster(Cluster cluster) {
            // Always render clusters.
            return cluster.getSize() > 1;
        }
    }

    private void addIcon(IconGenerator iconFactory, String text, LatLng position) {
        MarkerOptions markerOptions = new MarkerOptions().
                icon(BitmapDescriptorFactory.fromBitmap(iconFactory.makeIcon(text))).
                position(position).
                anchor(iconFactory.getAnchorU(), iconFactory.getAnchorV());

        getMap().addMarker(markerOptions);
    }
}
