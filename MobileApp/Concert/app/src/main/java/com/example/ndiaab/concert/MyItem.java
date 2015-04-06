package com.example.ndiaab.concert;

import com.google.android.gms.maps.model.LatLng;
import com.google.maps.android.clustering.ClusterItem;

public class MyItem implements ClusterItem {
    private LatLng mPosition;
    private String mLatitude = "";
    private String mStoreLogo = "";
    private String mLongitude = "";

    public MyItem(double lat, double lng) {
        mPosition = new LatLng(lat, lng);
    }

    @Override
    public LatLng getPosition() {
        return mPosition;
    }

    public void setPosition(LatLng mPosition) {
        this.mPosition = mPosition;
    }

    public LatLng getmPosition() {
        return mPosition;
    }

    public void setmPosition(LatLng mPosition) {
        this.mPosition = mPosition;
    }


    public String getmLatitude() {
        return mLatitude;
    }

    public void setmLatitude(String mLatitude) {
        this.mLatitude = mLatitude;
    }

    public String getmLongitude() {
        return mLongitude;
    }

    public void setmLongitude(String mLongitude) {
        this.mLongitude = mLongitude;
    }

    public String getmStoreLogo() {
        return mStoreLogo;
    }

    public void setmStoreLogo(String mStoreLogo) {
        this.mStoreLogo = mStoreLogo;
    }
}
