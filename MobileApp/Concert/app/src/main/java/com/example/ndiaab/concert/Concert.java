package com.example.ndiaab.concert;

import android.os.Parcel;
import android.os.Parcelable;
import android.util.Log;

import com.google.android.gms.maps.model.LatLng;
import com.google.maps.android.clustering.ClusterItem;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

/**
 * Created by ndiaab on 27/03/15.
 */
public class Concert implements Parcelable, ClusterItem {

    //Données Brut
    String id;
    String title;
    String artistes;
    String nom;
    String rue;
    String codePostal;
    String ville;
    String pays;
    Double lattitude;
    Double longitude;
    String url;
    String dateString;
    String urlImage;
    String urlGrandeImage="";
    String dateFormat;
    String heureFormat;
    long dateMillis;

    private String idMarker;

    //Récupération des données
    private ArrayList<String> mesArtistes;
    private LatLng coordonnées;

    public Concert () {
    }

    public Concert(String id, String title, String artistes, String nom, String rue, String codePostal, String ville, String pays, Double lattitude, Double longitude, String url, String dateString, String urlImage) throws ParseException {
        this.id = id;
        this.title = title;
        this.artistes = artistes;
        this.nom = nom;
        this.rue = rue;
        this.codePostal = codePostal;
        this.ville = ville;
        this.pays = pays;
        this.lattitude = lattitude;
        this.longitude = longitude;
        this.coordonnées = new LatLng(longitude,lattitude);
        this.url = url;
        this.dateString = dateString;
        this.urlImage = urlImage;
        setDateHeureFormat();
        //setUrlGrandeImage();
    }

    public Concert(Parcel source) {
        this.id = source.readString();
        this.title = source.readString();
        this.artistes = source.readString();
        this.nom = source.readString();
        this.rue = source.readString();
        this.codePostal = source.readString();
        this.ville = source.readString();
        this.pays = source.readString();
        this.lattitude = source.readDouble();
        this.longitude = source.readDouble();
        this.url = source.readString();
        this.dateString = source.readString();
        this.urlImage = source.readString();
        this.urlGrandeImage=source.readString();
        this.dateFormat=source.readString();
        this.heureFormat=source.readString();
        this.dateMillis=source.readLong();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getArtistes() {
        return artistes;
    }

    public void setArtistes(String artistes) {
        this.artistes = artistes;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getRue() {
        return rue;
    }

    public void setRue(String rue) {
        this.rue = rue;
    }

    public String getCodePostal() {
        return codePostal;
    }

    public void setCodePostal(String codePostal) {
        this.codePostal = codePostal;
    }

    public String getVille() {
        return ville;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }

    public String getPays() {
        return pays;
    }

    public void setPays(String pays) {
        this.pays = pays;
    }

    public Double getLattitude() {
        return lattitude;
    }

    public void setLattitude(Double lattitude) {
        this.lattitude = lattitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDateString() {
        return dateString;
    }

    public void setDateString(String dateString) {
        this.dateString = dateString;
    }

    public String getUrlImage() {
        return urlImage;
    }

    public void setUrlImage(String urlImage) {
        this.urlImage = urlImage;
    }

    public ArrayList<String> getMesArtistes() {
        return mesArtistes;
    }

    public void setMesArtistes(ArrayList<String> mesArtistes) {
        this.mesArtistes = mesArtistes;
    }

    public LatLng getCoordonnées() {
        return coordonnées;
    }

    public void setCoordonnées(LatLng coordonnées) {
        this.coordonnées = coordonnées;
    }

    public String getIdMarker() {
        return idMarker;
    }

    public void setIdMarker(String idMarker) {
        this.idMarker = idMarker;
    }

    public String getUrlGrandeImage() {
        return urlGrandeImage;
    }

    public void setUrlGrandeImage() {
        if (!urlImage.isEmpty() && !id.contains("pij"))
        {
            String[] decoupe = urlImage.split("/");
            this.urlGrandeImage = decoupe[0] + "/" + decoupe[1] + "/" + decoupe[2] + "/" + decoupe[3] + "/252/" + decoupe[5];
        }
    }


    public void setDateHeureFormat() throws ParseException {
        if(!id.contains("pij"))
        {
            //DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
            DateFormat formatter = new SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss", Locale.US);
            Date date = formatter.parse(this.dateString);

            Calendar cal = Calendar.getInstance();
            cal.setTime(date);
            System.out.println(cal.get(Calendar.DAY_OF_MONTH) + "/" + cal.get(Calendar.MONTH) + "/" + cal.get(Calendar.YEAR));
            int moisCalc = cal.get(Calendar.MONTH)+1;


            dateMillis = cal.getTimeInMillis();
            dateFormat = cal.get(Calendar.DAY_OF_MONTH)+"/"+moisCalc+"/"+cal.get(Calendar.YEAR);
            //Log.e("Date Concert", dateFormat);

            if(cal.get(Calendar.MINUTE)==0)
                heureFormat = String.valueOf(cal.get(Calendar.HOUR_OF_DAY)+":00");
            else
                heureFormat = String.valueOf(cal.get(Calendar.HOUR_OF_DAY)+":"+cal.get(Calendar.MINUTE));
        }
        else
        {
            String[] decoupe = dateString.split(" ");
            dateFormat=decoupe[0];
            heureFormat=decoupe[1];
            Log.e("test",dateFormat+" "+heureFormat);
        }
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(id);
        dest.writeString(title);
        dest.writeString(artistes);
        dest.writeString(nom);
        dest.writeString(rue);
        dest.writeString(codePostal);
        dest.writeString(ville);
        dest.writeString(pays);
        dest.writeDouble(lattitude);
        dest.writeDouble(longitude);
        dest.writeString(url);
        dest.writeString(dateString);
        dest.writeString(urlImage);
        dest.writeString(urlGrandeImage);
        dest.writeString(dateFormat);
        dest.writeString(heureFormat);
        dest.writeLong(dateMillis);
    }


    public static final Parcelable.Creator<Concert> CREATOR = new Parcelable.Creator<Concert>()
    {
        @Override
        public Concert createFromParcel(Parcel source)
        {
            return new Concert(source);
        }

        @Override
        public Concert[] newArray(int size)
        {
            return new Concert[size];
        }
    };

    @Override
    public LatLng getPosition() {
        return coordonnées;
    }
}
