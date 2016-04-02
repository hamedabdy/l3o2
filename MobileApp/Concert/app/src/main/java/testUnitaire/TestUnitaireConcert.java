package testUnitaire;

import android.test.InstrumentationTestCase;

import com.example.ndiaab.concert.Concert;

import java.text.ParseException;

/**
 * Created by ndiaab on 15/05/15.
 */
public class TestUnitaireConcert extends InstrumentationTestCase{


    public void test() throws Exception {
        final int expected = 5;
        final int reality = 5;
        assertEquals(expected, reality);
    }

    public void testCreationConcert() throws ParseException {
        final Concert expected;
        expected = new Concert("", "", "", "", "", "", "", "", 1.0, 2.0, "", "", "");
        final Concert reality = expected;
        assertEquals(expected,reality);
    }

    public void testReformatageUrl() throws Exception{

        final String expected = "http://userserve-ak.last.fm/serve/252/92864247.jpg";
        final Concert unConcert;
        unConcert = new Concert("", "", "", "", "", "", "", "", 1.0, 2.0, "", "", "http://userserve-ak.last.fm/serve/64/92864247.jpg");
        unConcert.setUrlGrandeImage();
        assertEquals(expected,unConcert.getUrlGrandeImage());
    }
}
