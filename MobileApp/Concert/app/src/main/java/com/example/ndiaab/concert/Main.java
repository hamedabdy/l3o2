package com.example.ndiaab.concert;


import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.location.Location;
import android.location.LocationManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Vibrator;
import android.provider.Settings;
import android.support.v4.app.ActionBarDrawerToggle;
import android.support.v4.app.FragmentActivity;
import android.support.v4.widget.DrawerLayout;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.AdapterView;
import android.widget.AutoCompleteTextView;
import android.widget.CheckBox;
import android.widget.RelativeLayout;
import android.widget.SearchView;
import android.widget.SeekBar;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.places.Place;
import com.google.android.gms.location.places.Places;
import com.google.android.gms.location.places.ui.PlacePicker;
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

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Random;

import static com.example.ndiaab.concert.R.drawable;
import static com.example.ndiaab.concert.R.id;
import static com.example.ndiaab.concert.R.layout;
import static com.example.ndiaab.concert.R.string;

public class Main extends FragmentActivity implements OnMapReadyCallback, GoogleMap.OnInfoWindowClickListener, GoogleMap.OnMarkerClickListener, GoogleMap.OnMyLocationButtonClickListener, GoogleMap.OnCameraChangeListener,
        ClusterManager.OnClusterClickListener<Concert>, ClusterManager.OnClusterInfoWindowClickListener<Concert>, ClusterManager.OnClusterItemClickListener<Concert>, ClusterManager.OnClusterItemInfoWindowClickListener<Concert>,
        GoogleApiClient.OnConnectionFailedListener, GoogleApiClient.ConnectionCallbacks, View.OnFocusChangeListener, View.OnClickListener, com.androidmapsextensions.GoogleMap.OnMapClickListener, TextView.OnEditorActionListener, AdapterView.OnItemClickListener, SeekBar.OnSeekBarChangeListener {

    private static final int PRIORITY_HIGH_ACCURACY = 100;
    private static final int PLACE_PICKER_REQUEST = 1;
    private GoogleMap mMap; // Might be null if Google Play services APK is not available.
    private ProgressDialog pDialog;

    //private ProgressDialog pDialog;

    // URL to get contacts JSON
    private double majLattitude=0;
    private double majLongitude=0;
    private int majDistance=20;
    private String majArtiste="";

    public ActionBarDrawerToggle mDrawerToggle;
    private DrawerLayout mDrawerLayout;
    // used to store app title
    private CharSequence mTitle;
    private CharSequence mDrawerTitle;

    private Random mRandom = new Random(1984);

    float mCurrentZoom;
    ArrayList<Marker> mMarkers;
    ArrayList<Marker> mClusterMarkers;

    private ClusterManager<Concert> mClusterManager;

    Vibrator vibreur;

    CheckBox checkBoxConcertPij;
    Boolean checkedPij = false;
    CheckBox checkBoxConcertDuJour;
    Boolean chekedConcertDuJour = false;
    SeekBar seekBarProgress;


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
    private GoogleApiClient mGoogleApiClient;
    Menu mMenu;
    SearchView searchView;
    private RelativeLayout mDrawerList;

    int progress = 0;

    Calendar dateDuJour=Calendar.getInstance();
    int mois = dateDuJour.get(Calendar.MONTH)+1;
    String dateDuJourString = dateDuJour.get(Calendar.DAY_OF_MONTH) + "/" + mois + "/" +dateDuJour.get(Calendar.YEAR);

    public void fermerClavier(){
        InputMethodManager imm = (InputMethodManager) this
                .getSystemService(Context.INPUT_METHOD_SERVICE);
        imm.hideSoftInputFromWindow(this.getCurrentFocus().getWindowToken(),0);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        vibreur = (Vibrator) getApplicationContext().getSystemService(getApplicationContext().VIBRATOR_SERVICE);
        System.out.println();


        mMarkers = new ArrayList<Marker>();
        mClusterMarkers = new ArrayList<Marker>();
        setContentView(layout.activity_main);
        infoConcert = new HashMap<>();
        mesConcerts = new ArrayList<>();
        mesMarkers = new ArrayList<>();
        setUpMapIfNeeded();
        mTitle = mDrawerTitle = getTitle();



        mDrawerLayout = (DrawerLayout) findViewById(id.container);
        mDrawerList = (RelativeLayout) findViewById(id.menu);
        mDrawerToggle = new ActionBarDrawerToggle(this, mDrawerLayout,
                drawable.ic_drawer, //nav menu toggle icon
                string.app_name, // nav drawer open - description for accessibility
                string.app_name // nav drawer close - description for accessibility
        ) {
            public void onDrawerClosed(View view) {
                getActionBar().setTitle(mTitle);
                // calling onPrepareOptionsMenu() to show action bar icons
                invalidateOptionsMenu();
            }

            public void onDrawerOpened(View drawerView) {
                getActionBar().setTitle(mDrawerTitle);
                fermerClavier();
                    // calling onPrepareOptionsMenu() to hide action bar icons
            }
        };



        mMap.setOnMarkerClickListener(this);
        mMap.setOnInfoWindowClickListener(this);
        mMap.setOnMyLocationButtonClickListener(this);
        mMap.setOnMapClickListener(this);

        mGoogleApiClient = new GoogleApiClient
                .Builder(this)
                .addApi(Places.GEO_DATA_API)
                .addApi(Places.PLACE_DETECTION_API)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .build();


        SeekBar seekBar = (SeekBar) findViewById(id.seekBar);
        seekBar.setOnSeekBarChangeListener(this);

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

        AutoCompleteTextView autoCompView = (AutoCompleteTextView) findViewById(id.rechercheVille);
        autoCompView.setAdapter(new GooglePlacesAutocompleteAdapter(this, layout.list_item));
        autoCompView.setOnItemClickListener(this);
        autoCompView.setOnEditorActionListener(this);

        checkBoxConcertPij = (CheckBox) findViewById(R.id.concertPij);
        checkBoxConcertDuJour = (CheckBox) findViewById(R.id.concertDuJour);
        seekBarProgress = (SeekBar) findViewById(id.seekBar);
    }

    public void onItemClick(AdapterView<?> adapterView, View view, int position, long id) {
        String str = (String) adapterView.getItemAtPosition(position);
        Toast.makeText(this, str, Toast.LENGTH_SHORT).show();
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
            mMap = ((SupportMapFragment) getSupportFragmentManager().findFragmentById(id.map))
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
        EnableGPSIfPossible();
        Location maLocation= mMap.getMyLocation();
        if (maLocation != null) {
            Double lat = maLocation.getLatitude();
            Double longitude = maLocation.getLongitude();
            setMajLattitude(lat);
            setMajLongitude(longitude);
            new GetConcerts().execute();
        }
        return false;
    }

    @Override
    public void onCameraChange(CameraPosition cameraPosition) {
    }

    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {
    }

    @Override
    public void onConnected(Bundle bundle) {
    }

    @Override
    public void onConnectionSuspended(int i) {

    }

    @Override
    public void onFocusChange(View v, boolean hasFocus) {
        if(!hasFocus) {
            mMenu.findItem(id.action_search).collapseActionView();
            Toast.makeText(Main.this, "Test On Focus !!", Toast.LENGTH_SHORT).show();
            //searchView.setQuery("", false);
        }

    }

    @Override
    public void onClick(View v) {
    }

    public void onClickBtnValider(View v) {
        int progression=0;
        mDrawerLayout.closeDrawer(mDrawerList);
        AutoCompleteTextView rechercheVille = (AutoCompleteTextView) findViewById(id.rechercheVille);
        rechercheVille.clearFocus();
        String uneVille= String.valueOf(rechercheVille.getText());
        rechercheVille.setText("");
        if(!uneVille.equalsIgnoreCase("")) {
            new GetGeocode(uneVille).execute();
            new GetConcerts().execute();
        }
        else
            if(majLongitude!=0 && majLattitude!=0)
            {
                if(checkBoxConcertDuJour.isChecked() != chekedConcertDuJour || checkBoxConcertPij.isChecked() != checkedPij || seekBarProgress.getProgress()!=progression)
                {
                    progression=seekBarProgress.getProgress();
                    chekedConcertDuJour=checkBoxConcertDuJour.isChecked();
                    checkedPij=checkBoxConcertPij.isChecked();
                    new GetConcerts().execute();
                }
            }

    }

    @Override
    public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
        boolean handled = false;
        if (actionId == EditorInfo.IME_ACTION_DONE) {
            //Toast.makeText(Main.this, "Test Du bouton !!", Toast.LENGTH_SHORT).show();
            handled = true;
            mDrawerLayout.closeDrawer(mDrawerList);
            AutoCompleteTextView rechercheVille = (AutoCompleteTextView) findViewById(id.rechercheVille);
            rechercheVille.clearFocus();
            String uneVille= String.valueOf(rechercheVille.getText());
            rechercheVille.setText("");
            if(!uneVille.equalsIgnoreCase("")) {
                new GetGeocode(uneVille).execute();
                new GetConcerts().execute();
            }
        }
        return false;
    }

    @Override
    public void onMapClick(LatLng latLng) {
        
    }

    @Override
    public void onProgressChanged(SeekBar seekBar, int progressValue, boolean fromUser) {
        progress = progressValue;
    }

    @Override
    public void onStartTrackingTouch(SeekBar seekBar) {
    }

    @Override
    public void onStopTrackingTouch(SeekBar seekBar) {
        if (progress <= 5) {
            Toast.makeText(Main.this, "Distance : 5 KM", Toast.LENGTH_SHORT).show();
            seekBar.setProgress(5);
            setMajDistance(seekBar.getProgress());
            vibreur.vibrate(200);
        } else if (progress <= 10) {
            Toast.makeText(Main.this, "Distance : 10 KM", Toast.LENGTH_SHORT).show();
            seekBar.setProgress(10);
            setMajDistance(seekBar.getProgress());
        } else if (progress > 10 & progress <= 20) {
            Toast.makeText(Main.this, "Distance : 20 KM", Toast.LENGTH_SHORT).show();
            seekBar.setProgress(20);
            setMajDistance(seekBar.getProgress());
        } else if (progress > 20 & progress <= 30) {
            Toast.makeText(Main.this, "Distance : 30 KM", Toast.LENGTH_SHORT).show();
            seekBar.setProgress(30);
            setMajDistance(seekBar.getProgress());
        } else if (progress > 30 & progress <= 40) {
            Toast.makeText(Main.this, "Distance : 40 KM", Toast.LENGTH_SHORT).show();
            seekBar.setProgress(40);
            setMajDistance(seekBar.getProgress());
        } else if (progress > 40 & progress <= 50) {
            Toast.makeText(Main.this, "Distance : 50 KM", Toast.LENGTH_SHORT).show();
            seekBar.setProgress(50);
            setMajDistance(seekBar.getProgress());
        } else if (progress > 50 & progress <= 60) {
            Toast.makeText(Main.this, "Distance : 60 KM", Toast.LENGTH_SHORT).show();
            seekBar.setProgress(60);
            setMajDistance(seekBar.getProgress());
        } else if (progress > 60 & progress <= 70) {
            Toast.makeText(Main.this, "Distance : 70 KM", Toast.LENGTH_SHORT).show();
            seekBar.setProgress(70);
            setMajDistance(seekBar.getProgress());
        } else if (progress > 70 & progress <= 80) {
            Toast.makeText(Main.this, "Distance : 80 KM", Toast.LENGTH_SHORT).show();
            seekBar.setProgress(80);
            setMajDistance(seekBar.getProgress());
        } else if (progress > 80 & progress <= 90) {
            Toast.makeText(Main.this, "Distance : 90 KM", Toast.LENGTH_SHORT).show();
            seekBar.setProgress(90);
            setMajDistance(seekBar.getProgress());
        } else if (progress > 90 & progress <= 100) {
            Toast.makeText(Main.this, "Distance : 100 KM", Toast.LENGTH_SHORT).show();
            seekBar.setProgress(100);
            setMajDistance(seekBar.getProgress());
            vibreur.vibrate(200);
        }
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
            mClusterMarkers.clear();
            mClusterManager.clearItems();
            //Origine
            String url = "http://concert-da-cote.herokuapp.com/concert?lat="+majLattitude+"&long="+majLongitude+"&range="+majDistance+"&artist="+majArtiste;
            Log.d("URL ",url);
            // Creating service handler class instance

            ServiceHandler sh = new ServiceHandler();

            // Making a request to url and getting response
            String jsonStr = sh.makeServiceCall(url, ServiceHandler.GET);

            if (jsonStr != null) {
                try {
                    JSONArray jsonObj = new JSONArray(jsonStr);

                    // looping through All Concerts
                    for (int i = 0; i < jsonObj.length() ; i++) {

                        JSONObject unConcert = jsonObj.getJSONObject(i);

                        String id = unConcert.getString(TAG_ID);
                        String title = unConcert.getString(TAG_TITLE);
                        String artists =unConcert.getString(TAG_ARTIST);

                        String nom ="";
                        String rue ="";
                        String codePostal="";
                        String ville = "";
                        String pays = "";
                        String image="";

                        if(id.contains("pij"))
                        {
                            rue = unConcert.getString(TAG_ADDRESS);
                            image="http://concert-da-cote.herokuapp.com/images/cadrij-small.jpg";
                        }
                        else
                        {
                            JSONObject address = unConcert.getJSONObject(TAG_ADDRESS);
                            nom =address.getString(TAG_NAME);
                            rue = address.getString(TAG_STREET);
                            codePostal = address.getString(TAG_POSTALCODE);
                            ville = address.getString(TAG_CITY);
                            pays = address.getString(TAG_COUNTRY);
                            image =unConcert.getString(TAG_IMAGE);
                        }

                        JSONArray coordonnees = unConcert.getJSONArray(TAG_LATLONG_TAB);
                        Double longitude = coordonnees.getDouble(0);
                        Double lattitude = coordonnees.getDouble(1);


                        String monUrl = unConcert.getString(TAG_URL);
                        String date = unConcert.getString(TAG_DATE);

                        ArrayList<String> artistes = new ArrayList<String>();
                        artistes.add(artists);
                        Concert monConcert = new Concert(id,title,artists,nom,rue,codePostal,ville,pays,lattitude,longitude,monUrl,date,image);

                        HashMap<String, String> concert = new HashMap<String, String>();
                        concert.put(TAG_ID,id);
                        concert.put(TAG_TITLE,title);
                        concert.put("longitude",String.valueOf(longitude));
                        concert.put("lattitude", String.valueOf(lattitude));

                        if(checkBoxConcertPij.isChecked() && checkBoxConcertDuJour.isChecked()) {
                            if (monConcert.getId().contains("pij"))
                                mesConcerts.add(monConcert);
                        }
                        else
                            if (checkBoxConcertPij.isChecked()){
                                if (monConcert.getId().contains("pij"))
                                mesConcerts.add(monConcert);
                            }
                            else
                                if(checkBoxConcertDuJour.isChecked()){
                                    //Log.e("Test Date Concert : ",monConcert.dateFormat);
                                    if(dateDuJourString.equalsIgnoreCase(monConcert.dateFormat) || monConcert.getId().contains("pij"))
                                        mesConcerts.add(monConcert);
                                }
                                else
                                {
                                    if(dateDuJour.getTimeInMillis()<monConcert.dateMillis || monConcert.getId().contains("pij"))
                                        mesConcerts.add(monConcert);
                                }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                } catch (ParseException e) {
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
                    mClusterManager.addItem(mesConcerts.get(i));
                    }
                }
                LatLng loc = new LatLng(majLattitude,majLongitude);
                mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(loc, 12));
                mMap.addMarker(new MarkerOptions()
                        .title("Ma Position")
                        .position(loc)
                        .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_AZURE)));
                Toast.makeText(Main.this, mesConcerts.size() + " concerts autour de vous !!", Toast.LENGTH_SHORT).show();
            }
        }
    }

    public class GetGeocode extends AsyncTask<Void, Void, Void> {

        Double mlongitude=0.0;
        Double mlatitude=0.0;
        String mRue="";
        String recherhe="";

        public GetGeocode(String recherhe) {
            this.recherhe = recherhe.replaceAll(" ","%20");
            System.out.println(this.recherhe);
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            mMap.clear();
            // Showing progress dialog
        }

        @Override
        protected Void doInBackground(Void... arg0) {
            mesConcerts.clear();
            mClusterMarkers.clear();
            mClusterManager.clearItems();
            
            //Origine
            String url = "https://maps.googleapis.com/maps/api/geocode/json?address="+recherhe;
            Log.d("URL ",url);

            // Creating service handler class instance
            ServiceHandler sh = new ServiceHandler();

            // Making a request to url and getting response
            String jsonStr = sh.makeServiceCall(url, ServiceHandler.GET);

            if (jsonStr != null) {
                try {
                    JSONObject jsonObj = new JSONObject(jsonStr);
                    JSONArray results = jsonObj.getJSONArray("results");
                    JSONObject test = results.getJSONObject(0);
                    String rue = test.getString("formatted_address");
                    JSONObject geometry = test.getJSONObject("geometry");
                    System.out.println(geometry);
                    JSONObject location = geometry.getJSONObject("location");
                    Double longitude = location.getDouble("lat");
                    Double lattitude = location.getDouble("lng");

                    mlongitude=longitude;
                    mlatitude=lattitude;
                    setMajLattitude(mlongitude);
                    setMajLongitude(mlatitude);
                    mRue=rue;

                    System.out.println(longitude);
                    System.out.println(lattitude);
                    System.out.println(rue);

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
            /*    LatLng loc = new LatLng(mlongitude,mlatitude);
                mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(loc, 9));
                mMap.addMarker(new MarkerOptions()
                        .title("Ma Position")
                        .position(loc)
                        .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_AZURE)));*/
                Toast.makeText(Main.this,mRue, Toast.LENGTH_SHORT).show();
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
        Intent intent = new Intent(this, Details.class);
        Concert unConcert = infoConcert.get(marker.getId());
        intent.putExtra("concert",unConcert);
        intent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
        startActivity(intent);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        mMenu = menu;
        inflater.inflate(R.menu.menu_information, menu);

        searchView = (SearchView) mMenu.findItem(id.action_search)
                .getActionView();
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case id.action_search:
                if (mDrawerLayout.isDrawerOpen(mDrawerList))
                {
                    mDrawerLayout.closeDrawer(mDrawerList);
                    //Clavier
                    InputMethodManager imm = (InputMethodManager) this
                            .getSystemService(Context.INPUT_METHOD_SERVICE);
                    imm.hideSoftInputFromWindow(this.getCurrentFocus().getWindowToken(),0);
                }
                else
                    mDrawerLayout.openDrawer(mDrawerList);
                return true;
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

    @Override
    public boolean onClusterClick(Cluster<Concert> cluster) {
        // Show a toast with some info when the cluster is clicked.
        Concert concert =  cluster.getItems().iterator().next();
        String firstName = concert.title;
        Double latitude=concert.lattitude;
        Double longitude=concert.longitude;
        Boolean uneSalleUnique=true;
        for(Concert unConcert:cluster.getItems())
        {
            if(!unConcert.lattitude.equals(latitude) || !unConcert.longitude.equals(longitude)){
                uneSalleUnique=false;
                break;
            }
        }
        if (uneSalleUnique==true){
            Intent intent = new Intent(this, Information.class);
            ArrayList<Concert> maListe = new ArrayList<>();
            for(Concert unConcert:cluster.getItems())
                maListe.add(unConcert);
            intent.putExtra("liste", maListe);
            startActivity(intent);
        }
        return true;
    }

    @Override
    public void onClusterInfoWindowClick(Cluster<Concert> cluster) {
        // Does nothing, but you could go to a list of the users.
        //Toast.makeText(this,"onClusterInfoWindowClick", Toast.LENGTH_SHORT).show();

    }

    @Override
    public boolean onClusterItemClick(Concert item) {
        // Does nothing, but you could go into the user's profile page, for example.
        return false;
    }

    @Override
    public void onClusterItemInfoWindowClick(Concert concert) {
        // Does nothing, but you could go into the user's profile page, for example.
        Intent intent = new Intent(this, Details.class);
        intent.putExtra("concert", concert);
        startActivity(intent);
    }


    private class PersonRenderer extends DefaultClusterRenderer<Concert> {

        public PersonRenderer() {
            super(getApplicationContext(), getMap(), mClusterManager);
        }

        @Override
        protected void onBeforeClusterItemRendered(Concert unConcert, MarkerOptions markerOptions) {

            markerOptions.title(unConcert.title);
            if(unConcert.id.contains("pij")){
            markerOptions.icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_GREEN));
            }
        }
        @Override
        protected boolean shouldRenderAsCluster(Cluster cluster) {
            // Always render clusters.
            return cluster.getSize() > 5;
        }
    }

    private  void buildAlertMessageNoGps() {
        final AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setMessage("Utiliser ma position ?")
                .setCancelable(false)
                .setPositiveButton("OUI", new DialogInterface.OnClickListener() {
                    public void onClick(final DialogInterface dialog,final int id) {
                        startActivity(new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS));
                    }
                })
                .setNegativeButton("NON", new DialogInterface.OnClickListener() {
                    public void onClick(final DialogInterface dialog,final int id) {
                        dialog.cancel();
                    }
                });
        final AlertDialog alert = builder.create();
        alert.show();
    }

    private void EnableGPSIfPossible()
    {
        final LocationManager manager = (LocationManager) getSystemService( Context.LOCATION_SERVICE );
        if ( !manager.isProviderEnabled( LocationManager.GPS_PROVIDER ) ) {
            buildAlertMessageNoGps();
        }
    }

    @Override
    protected void onStart() {
        super.onStart();
        mGoogleApiClient.connect();
    }

    @Override
    protected void onStop() {
        mGoogleApiClient.disconnect();
        super.onStop();
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            if (mDrawerLayout.isDrawerOpen(mDrawerList))
            {
                mDrawerLayout.closeDrawer(mDrawerList);
                //Clavier
                InputMethodManager imm = (InputMethodManager) this
                        .getSystemService(Context.INPUT_METHOD_SERVICE);
                imm.hideSoftInputFromWindow(this.getCurrentFocus().getWindowToken(),0);
                return true;
            }
        }
        return super.onKeyDown(keyCode, event);
    }

    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == PLACE_PICKER_REQUEST) {
            if (resultCode == RESULT_OK) {
                Place place = PlacePicker.getPlace(data, this);
                String toastMsg = String.format("Place: %s", place.getName());
                Toast.makeText(this, toastMsg, Toast.LENGTH_LONG).show();
            }
        }
    }
}
