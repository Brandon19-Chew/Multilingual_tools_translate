-- Update the handle_new_user function to support both username and email signups
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
  username_value text;
  email_value text;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  email_value := NEW.email;
  
  -- Extract username from email
  -- If email ends with @miaoda.com, use the part before @ as username
  -- Otherwise, use the part before @ from the email
  IF email_value LIKE '%@miaoda.com' THEN
    username_value := split_part(email_value, '@', 1);
  ELSE
    username_value := split_part(email_value, '@', 1);
  END IF;
  
  -- Ensure username is unique by appending numbers if needed
  WHILE EXISTS (SELECT 1 FROM profiles WHERE username = username_value) LOOP
    username_value := username_value || floor(random() * 1000)::text;
  END LOOP;
  
  -- Insert profile
  INSERT INTO public.profiles (id, username, email, role)
  VALUES (
    NEW.id,
    username_value,
    email_value,
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END
  );
  
  -- Create default settings
  INSERT INTO public.user_settings (user_id, theme, language)
  VALUES (NEW.id, 'light', 'en');
  
  RETURN NEW;
END;
$$;