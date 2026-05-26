-- Seed 200 fake profiles for load testing
-- 160 actors + 40 recruiters
-- Photos from randomuser.me (free, no auth)
-- Run in Supabase SQL Editor

DO $$
DECLARE
  i INTEGER;
  user_id UUID;
  fname TEXT;
  lname TEXT;
  full_name TEXT;
  user_role TEXT;
  photo_url TEXT;
  first_names TEXT[] := ARRAY[
    'Arjun','Vikram','Ravi','Kiran','Suresh','Mahesh','Rajesh','Anil','Sunil','Ramesh',
    'Priya','Ananya','Divya','Kavya','Shreya','Pooja','Deepa','Rekha','Sunita','Lalitha',
    'Venkat','Srinivas','Naresh','Praveen','Satish','Harish','Girish','Dinesh','Ganesh','Lokesh',
    'Rohit','Aakash','Nikhil','Tarun','Varun','Karthik','Abhishek','Siddharth','Akshay','Naga',
    'Meera','Swathi','Bhavana','Sruthi','Keerthi','Nandini','Pallavi','Madhuri','Anusha','Ramya'
  ];
  last_names TEXT[] := ARRAY[
    'Reddy','Rao','Kumar','Sharma','Naidu','Varma','Chowdary','Babu','Goud','Raju',
    'Nair','Pillai','Menon','Krishna','Prasad','Murthy','Sastry','Yadav','Patel','Verma',
    'Gupta','Mishra','Tiwari','Pandey','Joshi','Desai','Shah','Mehta','Kapoor','Malhotra'
  ];
  skills_options TEXT[][] := ARRAY[
    ARRAY['Acting','Dancing','Singing'],
    ARRAY['Action','Martial Arts','Stunts'],
    ARRAY['Comedy','Mimicry','Dancing'],
    ARRAY['Classical Dance','Acting','Modelling'],
    ARRAY['Horse Riding','Swimming','Acting'],
    ARRAY['Voiceover','Acting','Dubbing'],
    ARRAY['Theatre','Acting','Direction'],
    ARRAY['Dancing','Modelling','Acting'],
    ARRAY['Singing','Acting','Anchoring'],
    ARRAY['Action','Dancing','Acting']
  ];
  languages_options TEXT[][] := ARRAY[
    ARRAY['Telugu','Hindi','English'],
    ARRAY['Telugu','Tamil','English'],
    ARRAY['Telugu','Kannada','English'],
    ARRAY['Telugu','English'],
    ARRAY['Telugu','Hindi','Tamil','English'],
    ARRAY['Telugu','Urdu','English'],
    ARRAY['Telugu','Marathi','Hindi','English']
  ];
  locations TEXT[] := ARRAY[
    'Hyderabad','Secunderabad','Vijayawada','Visakhapatnam','Warangal',
    'Tirupati','Guntur','Nellore','Chennai','Bangalore',
    'Mumbai','Delhi','Kolkata','Pune','Ahmedabad'
  ];
  heights TEXT[] := ARRAY['5''3"','5''4"','5''5"','5''6"','5''7"','5''8"','5''9"','5''10"','5''11"','6''0"','6''1"','6''2"'];
  company_names TEXT[] := ARRAY[
    'Mythri Movie Makers','Geetha Arts','Sri Venkateswara Creations','UV Creations',
    'Sithara Entertainments','Haarika & Hassine Creations','People Media Factory',
    'Dil Raju Productions','14 Reels Plus','Arka Media Works',
    'Annapurna Studios','Ramanaidu Studios','Sri Balaji Video','Padmalaya Studios'
  ];
BEGIN
  FOR i IN 1..200 LOOP
    user_id := gen_random_uuid();

    fname := first_names[1 + (i % array_length(first_names, 1))];
    lname := last_names[1 + (i % array_length(last_names, 1))];
    full_name := fname || ' ' || lname;

    -- 160 actors, 40 recruiters
    IF i <= 160 THEN
      user_role := 'actor';
    ELSE
      user_role := 'recruiter';
    END IF;

    -- Alternate male/female photos
    IF i % 3 = 0 THEN
      photo_url := 'https://randomuser.me/api/portraits/women/' || (1 + (i % 99)) || '.jpg';
    ELSE
      photo_url := 'https://randomuser.me/api/portraits/men/' || (1 + (i % 99)) || '.jpg';
    END IF;

    -- Insert into auth.users (email confirmed, no real password — seed only)
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      aud,
      role,
      confirmation_token,
      recovery_token,
      is_sso_user
    ) VALUES (
      user_id,
      'seed_' || i || '@screenentry.test',
      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- not usable for login
      now(),
      now() - (i || ' days')::interval,
      now(),
      '{"provider":"email","providers":["email"]}',
      ('{"name":"' || full_name || '","role":"' || user_role || '"}')::jsonb,
      'authenticated',
      'authenticated',
      '',
      '',
      false
    )
    ON CONFLICT (id) DO NOTHING;

    -- Insert profile
    INSERT INTO public.profiles (
      id,
      name,
      email,
      role,
      location,
      age,
      height,
      skills,
      languages,
      company_name,
      profile_photo,
      photos,
      created_at
    ) VALUES (
      user_id,
      full_name,
      'seed_' || i || '@screenentry.test',
      user_role,
      locations[1 + (i % array_length(locations, 1))],
      CASE WHEN user_role = 'actor' THEN 18 + (i % 22) ELSE NULL END,
      CASE WHEN user_role = 'actor' THEN heights[1 + (i % array_length(heights, 1))] ELSE NULL END,
      CASE WHEN user_role = 'actor' THEN skills_options[1 + (i % array_length(skills_options, 1))] ELSE NULL END,
      CASE WHEN user_role = 'actor' THEN languages_options[1 + (i % array_length(languages_options, 1))] ELSE NULL END,
      CASE WHEN user_role = 'recruiter' THEN company_names[1 + (i % array_length(company_names, 1))] ELSE NULL END,
      photo_url,
      CASE WHEN user_role = 'actor' THEN
        ARRAY[
          photo_url,
          'https://randomuser.me/api/portraits/' || CASE WHEN i%3=0 THEN 'women' ELSE 'men' END || '/' || (1 + ((i+10) % 99)) || '.jpg'
        ]
      ELSE NULL END,
      now() - (i || ' days')::interval
    )
    ON CONFLICT (id) DO NOTHING;

  END LOOP;

  RAISE NOTICE 'Seeded 200 profiles successfully';
END $$;
