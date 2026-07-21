package com.darkbyte.zyotara;

import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.text.InputType;
import android.view.Gravity;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.card.MaterialCardView;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class MainActivity extends AppCompatActivity {
    private LinearLayout root;
    private SharedPreferences prefs;
    private final int purple = Color.rgb(91,63,214);
    private final int dark = Color.rgb(31,24,53);
    private final int bg = Color.rgb(247,245,255);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        prefs = getSharedPreferences("zyotara", MODE_PRIVATE);
        showHome();
    }

    private void resetRoot() {
        ScrollView scroll = new ScrollView(this);
        scroll.setFillViewport(true);
        scroll.setBackgroundColor(bg);
        root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(dp(20), dp(24), dp(20), dp(32));
        scroll.addView(root);
        setContentView(scroll);
    }

    private TextView text(String value, int size, boolean bold) {
        TextView tv = new TextView(this);
        tv.setText(value);
        tv.setTextSize(size);
        tv.setTextColor(dark);
        if (bold) tv.setTypeface(null, android.graphics.Typeface.BOLD);
        tv.setLineSpacing(0, 1.15f);
        return tv;
    }

    private void addSpace(int h) {
        Space s = new Space(this);
        s.setLayoutParams(new LinearLayout.LayoutParams(1, dp(h)));
        root.addView(s);
    }

    private MaterialButton button(String label) {
        MaterialButton b = new MaterialButton(this);
        b.setText(label);
        b.setTextSize(16);
        b.setTextColor(Color.WHITE);
        b.setBackgroundTintList(android.content.res.ColorStateList.valueOf(purple));
        b.setCornerRadius(dp(16));
        b.setAllCaps(false);
        return b;
    }

    private MaterialCardView card() {
        MaterialCardView c = new MaterialCardView(this);
        c.setCardBackgroundColor(Color.WHITE);
        c.setRadius(dp(20));
        c.setCardElevation(dp(2));
        c.setStrokeWidth(dp(1));
        c.setStrokeColor(Color.rgb(231,226,247));
        LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(-1, -2);
        p.setMargins(0, 0, 0, dp(14));
        c.setLayoutParams(p);
        return c;
    }

    private void showHome() {
        resetRoot();
        TextView brand = text("✦ ZYOTARA", 28, true);
        brand.setTextColor(purple);
        root.addView(brand);
        root.addView(text("Your personal AI astrology guide", 16, false));
        addSpace(22);

        String name = prefs.getString("name", "");
        if (name.isEmpty()) {
            MaterialCardView welcome = card();
            LinearLayout box = new LinearLayout(this);
            box.setOrientation(LinearLayout.VERTICAL);
            box.setPadding(dp(18), dp(18), dp(18), dp(18));
            box.addView(text("Create your birth profile", 21, true));
            box.addView(text("Add your birth details to unlock personalised guidance.", 15, false));
            Space s = new Space(this);
            s.setLayoutParams(new LinearLayout.LayoutParams(1, dp(14)));
            box.addView(s);
            MaterialButton start = button("Create profile");
            start.setOnClickListener(v -> showProfile());
            box.addView(start);
            welcome.addView(box);
            root.addView(welcome);
        } else {
            root.addView(text("Namaste, " + name + " 👋", 23, true));
            root.addView(text(todayLine(), 15, false));
            addSpace(16);
            addLifeScores();
            addDailyGuidance();
        }

        MaterialButton chat = button("Ask Zyotara");
        chat.setOnClickListener(v -> showChat());
        root.addView(chat);
        addSpace(10);

        MaterialButton profile = button(name.isEmpty() ? "Birth profile" : "Edit birth profile");
        profile.setBackgroundTintList(android.content.res.ColorStateList.valueOf(Color.rgb(74,62,120)));
        profile.setOnClickListener(v -> showProfile());
        root.addView(profile);

        addSpace(18);
        TextView disclaimer = text("Astrology guidance is for reflection and entertainment. Do not use it as a substitute for medical, legal or financial advice.", 12, false);
        disclaimer.setTextColor(Color.DKGRAY);
        root.addView(disclaimer);
    }

    private String todayLine() {
        return new SimpleDateFormat("EEEE, d MMMM", Locale.getDefault()).format(new Date())
                + " • Your daily guidance is ready";
    }

    private void addLifeScores() {
        root.addView(text("Life scores", 20, true));
        addSpace(8);
        String[] labels = {"Career", "Money", "Relationship", "Health"};
        int[] scores = {82, 71, 76, 79};
        for (int i = 0; i < labels.length; i++) {
            MaterialCardView c = card();
            LinearLayout row = new LinearLayout(this);
            row.setGravity(Gravity.CENTER_VERTICAL);
            row.setPadding(dp(16), dp(14), dp(16), dp(14));
            TextView l = text(labels[i], 16, true);
            row.addView(l, new LinearLayout.LayoutParams(0, -2, 1));
            TextView score = text(scores[i] + "/100", 18, true);
            score.setTextColor(purple);
            row.addView(score);
            c.addView(row);
            root.addView(c);
        }
    }

    private void addDailyGuidance() {
        root.addView(text("Today's action plan", 20, true));
        addSpace(8);
        MaterialCardView c = card();
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setPadding(dp(18), dp(18), dp(18), dp(18));
        box.addView(text("✓ Best focus", 15, true));
        box.addView(text("Finish one important task before noon and contact an old professional connection.", 15, false));
        box.addView(text("\n⚠ Avoid", 15, true));
        box.addView(text("Impulsive spending and emotionally charged conversations.", 15, false));
        box.addView(text("\nLucky colour: Indigo • Favourable time: 10:20 AM–12:15 PM", 14, true));
        c.addView(box);
        root.addView(c);
    }

    private TextInputLayout field(String hint, int type) {
        TextInputLayout layout = new TextInputLayout(this);
        layout.setHint(hint);
        layout.setBoxBackgroundMode(TextInputLayout.BOX_BACKGROUND_OUTLINE);
        TextInputEditText edit = new TextInputEditText(this);
        edit.setInputType(type);
        layout.addView(edit);
        LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(-1, -2);
        p.setMargins(0, 0, 0, dp(12));
        layout.setLayoutParams(p);
        return layout;
    }

    private void showProfile() {
        resetRoot();
        TextView back = text("← Back", 16, true);
        back.setTextColor(purple);
        back.setOnClickListener(v -> showHome());
        root.addView(back);
        addSpace(16);
        root.addView(text("Birth profile", 28, true));
        root.addView(text("Accurate details help personalise future astrology calculations.", 15, false));
        addSpace(20);

        TextInputLayout nameL = field("Name", InputType.TYPE_CLASS_TEXT);
        TextInputLayout dateL = field("Date of birth (DD/MM/YYYY)", InputType.TYPE_CLASS_DATETIME);
        TextInputLayout timeL = field("Birth time (for example 08:45 PM)", InputType.TYPE_CLASS_TEXT);
        TextInputLayout placeL = field("Birthplace", InputType.TYPE_CLASS_TEXT);
        root.addView(nameL); root.addView(dateL); root.addView(timeL); root.addView(placeL);

        nameL.getEditText().setText(prefs.getString("name", ""));
        dateL.getEditText().setText(prefs.getString("dob", ""));
        timeL.getEditText().setText(prefs.getString("time", ""));
        placeL.getEditText().setText(prefs.getString("place", ""));

        MaterialButton save = button("Save profile");
        save.setOnClickListener(v -> {
            String n = String.valueOf(nameL.getEditText().getText()).trim();
            if (n.isEmpty()) {
                nameL.setError("Please enter your name");
                return;
            }
            prefs.edit()
                    .putString("name", n)
                    .putString("dob", String.valueOf(dateL.getEditText().getText()).trim())
                    .putString("time", String.valueOf(timeL.getEditText().getText()).trim())
                    .putString("place", String.valueOf(placeL.getEditText().getText()).trim())
                    .apply();
            Toast.makeText(this, "Profile saved", Toast.LENGTH_SHORT).show();
            showHome();
        });
        root.addView(save);
    }

    private void showChat() {
        resetRoot();
        TextView back = text("← Back", 16, true);
        back.setTextColor(purple);
        back.setOnClickListener(v -> showHome());
        root.addView(back);
        addSpace(14);
        root.addView(text("Ask Zyotara", 28, true));
        root.addView(text("Demo assistant. Real chart calculations and AI will be connected in the next phase.", 14, false));
        addSpace(18);

        TextInputLayout qL = field("Ask about career, relationships or your day",
                InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_MULTI_LINE);
        root.addView(qL);
        MaterialButton ask = button("Get guidance");
        root.addView(ask);
        addSpace(16);

        MaterialCardView answerCard = card();
        LinearLayout answerBox = new LinearLayout(this);
        answerBox.setPadding(dp(18), dp(18), dp(18), dp(18));
        TextView answer = text("Your guidance will appear here.", 15, false);
        answerBox.addView(answer);
        answerCard.addView(answerBox);
        root.addView(answerCard);

        ask.setOnClickListener(v -> {
            String q = String.valueOf(qL.getEditText().getText()).trim().toLowerCase(Locale.ROOT);
            if (q.isEmpty()) {
                qL.setError("Please enter a question");
                return;
            }
            String response;
            if (q.contains("career") || q.contains("job") || q.contains("business")) {
                response = "Career guidance\n\nFocus on one practical opportunity rather than many scattered options. Avoid resigning impulsively.\n\nAction: complete one difficult task before noon.";
            } else if (q.contains("love") || q.contains("marriage") || q.contains("relationship")) {
                response = "Relationship guidance\n\nCommunication matters more than prediction today.\n\nAction: choose a calm time for one honest conversation.";
            } else if (q.contains("money") || q.contains("invest")) {
                response = "Money guidance\n\nKeep decisions conservative. Astrology is not investment advice.\n\nAction: review one recurring expense.";
            } else {
                response = "Personal guidance\n\nWrite down the result you want, one risk and one action you can complete today.";
            }
            answer.setText(response);
        });
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }
}
